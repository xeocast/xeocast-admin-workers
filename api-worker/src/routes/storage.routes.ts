// src/routes/storage.ts
import { z } from 'zod';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env';

// Handlers
import { uploadObjectHandler } from '../handlers/storage/upload-object.handler';
import { downloadObjectHandler } from '../handlers/storage/download-object.handler';
import { deleteObjectHandler } from '../handlers/storage/delete-object.handler';
import { getPresignedUrlToUploadHandler } from '../handlers/storage/presigned-url-to-upload.handler';
import { getPresignedUrlToDownloadHandler } from '../handlers/storage/presigned-url-to-download.handler';
import { getPresignedUrlToDeleteHandler } from '../handlers/storage/presigned-url-to-delete.handler';
import { getPresignedUrlToHeadHandler } from '../handlers/storage/presigned-url-to-head.handler';

// Schemas
import {
    UploadObjectFormSchema,
    UploadObjectSuccessResponseSchema,
    ObjectPathParamsSchema,
    DeleteObjectSuccessResponseSchema,
    BucketNotFoundErrorSchema,
    ObjectNotFoundErrorSchema,
    FileUploadErrorSchema,
    R2OperationErrorSchema,
    InvalidKeyErrorSchema,
    InvalidCustomMetadataErrorSchema,
    MissingContentTypeErrorSchema,
    GetPresignedUrlToUploadRequestSchema,
    GetPresignedUrlToUploadSuccessResponseSchema,
    GetPresignedUrlToDownloadRequestSchema,
    GetPresignedUrlToDownloadSuccessResponseSchema,
    GetPresignedUrlToDeleteRequestSchema,
    GetPresignedUrlToDeleteSuccessResponseSchema,
    GetPresignedUrlToHeadRequestSchema,
    GetPresignedUrlToHeadSuccessResponseSchema
} from '../schemas/storage.schemas';
import {
    GeneralBadRequestErrorSchema,
} from '../schemas/common.schemas';

const storageRoutes = new OpenAPIHono<{
    Bindings: CloudflareEnv;
    Variables: {};
}>();

// --- Upload Object Route ---
const uploadRoute = createRoute({
    method: 'post',
    path: '/',
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: UploadObjectFormSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'File uploaded successfully.',
            content: {
                'application/json': {
                    schema: UploadObjectSuccessResponseSchema,
                },
            },
        },
        400: {
            description: 'Bad Request - Invalid input, file error, or validation issue.',
            content: {
                'application/json': {
                    schema: z.union([
                        GeneralBadRequestErrorSchema, // For general Zod validation errors
                        FileUploadErrorSchema, 
                        InvalidKeyErrorSchema, 
                        InvalidCustomMetadataErrorSchema,
                        MissingContentTypeErrorSchema
                    ]),
                },
            },
        },
        500: {
            description: 'Server Error - Bucket not found or R2 operation failed.',
            content: {
                'application/json': {
                    schema: z.union([BucketNotFoundErrorSchema, R2OperationErrorSchema]),
                },
            },
        },
    },
    summary: 'Upload an object to R2 storage.',
    description: 'Uploads a file to a specified R2 bucket. Object key can be provided or will be auto-generated. Custom metadata can be included.',
    tags: ['Storage'],
});

storageRoutes.openapi(uploadRoute, uploadObjectHandler);

// --- Download Object Route ---
const downloadRoute = createRoute({
    method: 'get',
    path: '/{logicalBucketName}/{objectKey}', // :objectKey(.*) is handled by Hono's regex path matching
    request: {
        params: ObjectPathParamsSchema,
    },
    responses: {
        200: {
            description: 'File stream of the object.',
            // For binary data, content type is usually set by the handler dynamically
            // OpenAPI spec for file download can be tricky; often `format: binary` is used.
            // Hono will return a Response object directly, not JSON for success.
            // We can describe the headers that will be present.
            headers: z.object({
                'Content-Type': z.string().openapi({ example: 'image/png' }),
                'Content-Length': z.string().openapi({ example: '1024768' }),
                'ETag': z.string().openapi({ example: '"abc123xyz789"' }),
                // Add other headers like 'Last-Modified' if your R2 objects have them and you pass them through
            }).openapi('DownloadHeaders'),
        },
        400: {
            description: 'Bad Request - Invalid path parameters.',
            content: {
                'application/json': {
                    schema: GeneralBadRequestErrorSchema,
                },
            },
        },
        404: {
            description: 'Not Found - Object not found in the specified bucket.',
            content: {
                'application/json': {
                    schema: ObjectNotFoundErrorSchema,
                },
            },
        },
        500: {
            description: 'Server Error - Bucket not found or R2 operation failed.',
            content: {
                'application/json': {
                    schema: z.union([BucketNotFoundErrorSchema, R2OperationErrorSchema]),
                },
            },
        },
    },
    summary: 'Download an object from R2 storage.',
    description: 'Downloads/retrieves an object from the specified R2 bucket using its key. The object key can contain slashes.',
    tags: ['Storage'],
});

// For routes with path parameters that include slashes like objectKey, Hono needs a regex.
// Example: /:logicalBucketName/:objectKey{.*}
// The OpenAPI path should reflect this if needed, but Hono handles it internally.
// The path in createRoute is for OpenAPI documentation, Hono's router uses the path given to storageRoutes.get(...)
storageRoutes.openapi(downloadRoute, downloadObjectHandler, (result, c) => {
    if (!result.success) {
        // Handle validation failure from zValidator for path params
        return c.json(GeneralBadRequestErrorSchema.parse({
            success: false,
            message: 'Invalid path parameters provided.',
            // errors: result.error.flatten().fieldErrors
        }), 400);
    }
});

// --- Delete Object Route ---
const deleteRoute = createRoute({
    method: 'delete',
    path: '/{logicalBucketName}/{objectKey}', // Similar to download for objectKey
    request: {
        params: ObjectPathParamsSchema,
    },
    responses: {
        200: {
            description: 'Object deleted successfully.',
            content: {
                'application/json': {
                    schema: DeleteObjectSuccessResponseSchema,
                },
            },
        },
        400: {
            description: 'Bad Request - Invalid path parameters.',
            content: {
                'application/json': {
                    schema: GeneralBadRequestErrorSchema,
                },
            },
        },
        // R2 delete is idempotent, so a 404 for object not found is often not returned unless checked first.
        // If you add a check, you can include ObjectNotFoundErrorSchema here for 404.
        500: {
            description: 'Server Error - Bucket not found or R2 operation failed.',
            content: {
                'application/json': {
                    schema: z.union([BucketNotFoundErrorSchema, R2OperationErrorSchema]),
                },
            },
        },
    },
    summary: 'Delete an object from R2 storage.',
    description: 'Deletes an object from the specified R2 bucket using its key. The object key can contain slashes.',
    tags: ['Storage'],
});

storageRoutes.openapi(deleteRoute, deleteObjectHandler, (result, c) => {
    if (!result.success) {
        return c.json(GeneralBadRequestErrorSchema.parse({
            success: false,
            message: 'Invalid path parameters provided.',
            // errors: result.error.flatten().fieldErrors
        }), 400);
    }
});

// --- Get Upload URL Route ---
const getPresignedUrlToUploadRoute = createRoute({
    method: 'get',
    path: '/presigned-url-to-upload',
    request: {
        query: GetPresignedUrlToUploadRequestSchema,
    },
    responses: {
        200: {
            description: 'Successfully generated presigned URL for upload.',
            content: {
                'application/json': {
                    schema: GetPresignedUrlToUploadSuccessResponseSchema,
                },
            },
        },
        400: {
            description: 'Bad Request - Invalid input or missing query parameters.',
            content: {
                'application/json': {
                    schema: GeneralBadRequestErrorSchema, // For Zod validation errors
                },
            },
        },
        404: {
            description: 'Bucket Not Found - The specified bucket binding was not found.',
            content: {
                'application/json': {
                    schema: BucketNotFoundErrorSchema,
                },
            },
        },
        500: {
            description: 'Server Error - Failed to generate presigned URL.',
            content: {
                'application/json': {
                    schema: R2OperationErrorSchema,
                },
            },
        },
    },
    summary: 'Get a presigned URL for uploading an object to R2.',
    description: 'Requests a presigned URL that can be used to PUT an object directly into a specified R2 bucket and key. The URL has a limited validity period.',
    tags: ['Storage'],
});

storageRoutes.openapi(getPresignedUrlToUploadRoute, getPresignedUrlToUploadHandler);

// --- Get Presigned URL to Download Route ---
const getPresignedUrlToDownloadRoute = createRoute({
    method: 'get',
    path: '/presigned-url-to-download',
    request: {
        query: GetPresignedUrlToDownloadRequestSchema,
    },
    responses: {
        200: {
            description: 'Successfully generated presigned URL for download.',
            content: {
                'application/json': {
                    schema: GetPresignedUrlToDownloadSuccessResponseSchema,
                },
            },
        },
        400: {
            description: 'Bad Request - Invalid input or missing query parameters.',
            content: {
                'application/json': {
                    schema: GeneralBadRequestErrorSchema,
                },
            },
        },
        404: {
            description: 'Bucket Not Found - The specified bucket binding was not found.',
            content: {
                'application/json': {
                    schema: BucketNotFoundErrorSchema,
                },
            },
        },
        500: {
            description: 'Server Error - Failed to generate presigned URL.',
            content: {
                'application/json': {
                    schema: R2OperationErrorSchema,
                },
            },
        },
    },
    summary: 'Get a presigned URL for downloading an object from R2.',
    description: 'Requests a presigned URL that can be used to GET an object directly from a specified R2 bucket and key. The URL has a limited validity period.',
    tags: ['Storage'],
});

storageRoutes.openapi(getPresignedUrlToDownloadRoute, getPresignedUrlToDownloadHandler);

// --- Get Presigned URL to Delete Route ---
const getPresignedUrlToDeleteRoute = createRoute({
    method: 'get',
    path: '/presigned-url-to-delete',
    request: {
        query: GetPresignedUrlToDeleteRequestSchema,
    },
    responses: {
        200: {
            description: 'Successfully generated presigned URL for deletion.',
            content: {
                'application/json': {
                    schema: GetPresignedUrlToDeleteSuccessResponseSchema,
                },
            },
        },
        400: {
            description: 'Bad Request - Invalid input or missing query parameters.',
            content: {
                'application/json': {
                    schema: GeneralBadRequestErrorSchema,
                },
            },
        },
        404: {
            description: 'Bucket Not Found - The specified bucket binding was not found.',
            content: {
                'application/json': {
                    schema: BucketNotFoundErrorSchema,
                },
            },
        },
        500: {
            description: 'Server Error - Failed to generate presigned URL.',
            content: {
                'application/json': {
                    schema: R2OperationErrorSchema,
                },
            },
        },
    },
    summary: 'Get a presigned URL for deleting an object from R2.',
    description: 'Requests a presigned URL that can be used to DELETE an object directly from a specified R2 bucket and key. The URL has a limited validity period.',
    tags: ['Storage'],
});

storageRoutes.openapi(getPresignedUrlToDeleteRoute, getPresignedUrlToDeleteHandler);

// --- Get Presigned URL to Head Route ---
const getPresignedUrlToHeadRoute = createRoute({
    method: 'get',
    path: '/presigned-url-to-head',
    request: {
        query: GetPresignedUrlToHeadRequestSchema,
    },
    responses: {
        200: {
            description: 'Successfully generated presigned URL for head operation.',
            content: {
                'application/json': {
                    schema: GetPresignedUrlToHeadSuccessResponseSchema,
                },
            },
        },
        400: {
            description: 'Bad Request - Invalid input or missing query parameters.',
            content: {
                'application/json': {
                    schema: GeneralBadRequestErrorSchema,
                },
            },
        },
        404: {
            description: 'Bucket Not Found - The specified bucket binding was not found.',
            content: {
                'application/json': {
                    schema: BucketNotFoundErrorSchema,
                },
            },
        },
        500: {
            description: 'Server Error - Failed to generate presigned URL.',
            content: {
                'application/json': {
                    schema: R2OperationErrorSchema,
                },
            },
        },
    },
    summary: 'Get a presigned URL for performing a head operation on an object in R2.',
    description: 'Requests a presigned URL that can be used to HEAD an object directly from a specified R2 bucket and key. The URL has a limited validity period.',
    tags: ['Storage'],
});

storageRoutes.openapi(getPresignedUrlToHeadRoute, getPresignedUrlToHeadHandler);

export default storageRoutes;
