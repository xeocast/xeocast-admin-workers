// src/routes/storage.ts
import { z } from 'zod';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import type { CloudflareEnv } from '../env';

// Handlers
import { uploadObjectHandler } from '../handlers/storage/uploadObject.handler';
import { downloadObjectHandler } from '../handlers/storage/downloadObject.handler';
import { deleteObjectHandler } from '../handlers/storage/deleteObject.handler';

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
    MissingContentTypeErrorSchema
} from '../schemas/storageSchemas';
import {
    GeneralBadRequestErrorSchema,
    GeneralNotFoundErrorSchema, // For download 404 if object not found
    GeneralServerErrorSchema
} from '../schemas/commonSchemas';

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

export default storageRoutes;
