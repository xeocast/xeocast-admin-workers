// src/schemas/storageSchemas.ts
import { z } from '@hono/zod-openapi';
import {
    MessageResponseSchema,
    GeneralBadRequestErrorSchema,
    GeneralNotFoundErrorSchema,
    GeneralServerErrorSchema
} from './common.schemas';

// Define the R2 bucket names based on wrangler.jsonc and env.d.ts
// These should match the bindings configured in your wrangler.jsonc and CloudflareEnv interface
export const R2BucketNameSchema = z.enum([
    'EPISODE_PROJECTS_BUCKET',
    'DEFAULT_FILES_BUCKET'
]).openapi('R2BucketName');

// Schema for the multipart/form-data upload request
// For OpenAPI documentation, Hono/zod-openapi treats file uploads as `type: 'string', format: 'binary'`.
// Actual validation of File instance will happen in the handler.
export const UploadObjectFormSchema = z.object({
    // 'file' will be handled as `c.req.formData()` which returns `File` instances or strings.
    // For schema definition, we describe it as a binary string for OpenAPI.
    // We cannot directly use z.instanceof(File) in the schema that Hono sends to OpenAPI.
    // The handler will perform the actual check for `instanceof File`.
    file: z.any().openapi({ type: 'string', format: 'binary', description: 'The file to upload.' }),
    bucket: R2BucketNameSchema.openapi({ description: 'Logical name of the target R2 bucket.' }),
    key: z.string().optional().openapi({ example: 'path/to/your/file.txt', description: 'Desired object key (path and filename). If not provided, a UUID will be generated.' }),
    contentType: z.string().optional().openapi({ example: 'image/png', description: 'MIME type of the file. If not sent, file.type from FormData is used.' }),
    customMetadata: z.string().optional().refine(
        (val) => {
            if (val === undefined) return true; // Optional field, valid if not present
            try {
                const parsed = JSON.parse(val);
                return typeof parsed === 'object' && parsed !== null; // Ensure it's an object
            } catch {
                return false;
            }
        },
        { message: 'customMetadata must be a valid JSON string representing an object.' }
    ).openapi({type: 'string', format: 'json', example: '{"userId":"123", "source":"uploadForm"}', description: 'Stringified JSON object for custom R2 object metadata.'})
}).openapi('UploadObjectForm');


export const UploadObjectSuccessResponseSchema = MessageResponseSchema.extend({
    message: z.literal('File uploaded successfully.'),
    objectKey: z.string().openapi({ example: 'unique-generated-key/file.jpg' }),
    bucket: R2BucketNameSchema,
    // The actual URL depends on whether you have a public domain configured for your R2 bucket.
    // This is more for illustrative purposes or if you construct it manually.
    url: z.string().url().optional().openapi({ example: 'https://your-r2-public-url/unique-generated-key/file.jpg', description: 'Public URL if the bucket is public and a domain is configured.' })
}).openapi('UploadObjectSuccessResponse');

// Schemas for path parameters for download/delete operations
export const ObjectPathParamsSchema = z.object({
    logicalBucketName: R2BucketNameSchema.openapi({
        param: {
            name: 'logicalBucketName',
            in: 'path',
            required: true,
        },
        description: 'Logical name of the R2 bucket (e.g., EPISODE_PROJECTS_BUCKET or DEFAULT_FILES_BUCKET).',
        example: 'EPISODE_PROJECTS_BUCKET'
    }),
    objectKey: z.string().openapi({
        param: {
            name: 'objectKey',
            in: 'path',
            required: true,
        },
        description: 'Full key of the object in R2 (e.g., videos/raw/episode1.mp4). The (.*) in the route allows slashes.',
        example: 'videos/raw/episode1.mp4'
    })
}).openapi('ObjectPathParams');

// For Download, the success response is typically the file stream itself (Response object),
// not a JSON. OpenAPI might describe this as `format: 'binary'` or similar.
// We won't define a specific Zod schema for the success body of a download,
// as Hono handlers will return a `Response` object directly.

// Delete response schema
export const DeleteObjectSuccessResponseSchema = MessageResponseSchema.extend({
    message: z.literal('Object deleted successfully.'),
    objectKey: z.string().openapi({example: 'path/to/your/file.txt'}),
    bucket: R2BucketNameSchema
}).openapi('DeleteObjectSuccessResponse');

// Schema for GetUploadUrl request
export const GetPresignedUrlToUploadRequestSchema = z.object({
    bucket: R2BucketNameSchema.openapi({ param: { name: 'bucket', in: 'query', required: true }, description: 'Logical name of the target R2 bucket for upload.' }),
    key: z.string().min(1).openapi({ param: { name: 'key', in: 'query', required: true }, example: 'uploads/myfile.png', description: 'The desired object key (path and filename) for the upload.' }),
    contentType: z.string().optional().openapi({ param: { name: 'contentType', in: 'query', required: false }, example: 'image/png', description: 'MIME type of the file to be uploaded. If not provided, the uploader will need to set it.' }),
}).openapi('GetPresignedUrlToUploadRequest');

// Schema for GetUploadUrl success response
export const GetPresignedUrlToUploadSuccessResponseSchema = z.object({
    url: z.string().url().openapi({ example: 'https://presigned-url-for-upload...', description: 'The presigned URL to use for uploading the file.' }),
    method: z.literal('PUT').openapi({ description: 'The HTTP method to use with the presigned URL (always PUT for uploads).' }),
}).openapi('GetPresignedUrlToUploadSuccessResponse');

// Schema for GetPresignedUrlToDownload request
export const GetPresignedUrlToDownloadRequestSchema = z.object({
    bucket: R2BucketNameSchema.openapi({ param: { name: 'bucket', in: 'query', required: true }, description: 'Logical name of the target R2 bucket for download.' }),
    key: z.string().min(1).openapi({ param: { name: 'key', in: 'query', required: true }, example: 'downloads/myfile.png', description: 'The desired object key (path and filename) for the download.' }),
}).openapi('GetPresignedUrlToDownloadRequest');

// Schema for GetPresignedUrlToDownload success response
export const GetPresignedUrlToDownloadSuccessResponseSchema = z.object({
    url: z.string().url().openapi({ example: 'https://presigned-url-for-download...', description: 'The presigned URL to use for downloading the file.' }),
    method: z.literal('GET').openapi({ description: 'The HTTP method to use with the presigned URL (always GET for downloads).' }),
}).openapi('GetPresignedUrlToDownloadSuccessResponse');

// Schema for GetPresignedUrlToDelete request
export const GetPresignedUrlToDeleteRequestSchema = z.object({
    bucket: R2BucketNameSchema.openapi({ param: { name: 'bucket', in: 'query', required: true }, description: 'Logical name of the target R2 bucket for deletion.' }),
    key: z.string().min(1).openapi({ param: { name: 'key', in: 'query', required: true }, example: 'to-delete/myfile.png', description: 'The desired object key (path and filename) for deletion.' }),
}).openapi('GetPresignedUrlToDeleteRequest');

// Schema for GetPresignedUrlToDelete success response
export const GetPresignedUrlToDeleteSuccessResponseSchema = z.object({
    url: z.string().url().openapi({ example: 'https://presigned-url-for-delete...', description: 'The presigned URL to use for deleting the file.' }),
    method: z.literal('DELETE').openapi({ description: 'The HTTP method to use with the presigned URL (always DELETE for deletions).' }),
}).openapi('GetPresignedUrlToDeleteSuccessResponse');

// Schema for GetPresignedUrlToHead request
export const GetPresignedUrlToHeadRequestSchema = z.object({
    bucket: R2BucketNameSchema.openapi({ param: { name: 'bucket', in: 'query', required: true }, description: 'Logical name of the target R2 bucket for head operation.' }),
    key: z.string().min(1).openapi({ param: { name: 'key', in: 'query', required: true }, example: 'check-metadata/myfile.png', description: 'The desired object key (path and filename) for head operation.' }),
}).openapi('GetPresignedUrlToHeadRequest');

// Schema for GetPresignedUrlToHead success response
export const GetPresignedUrlToHeadSuccessResponseSchema = z.object({
    url: z.string().url().openapi({ example: 'https://presigned-url-for-head...', description: 'The presigned URL to use for head operation.' }),
    method: z.literal('HEAD').openapi({ description: 'The HTTP method to use with the presigned URL (always HEAD for head operations).' }),
}).openapi('GetPresignedUrlToHeadSuccessResponse');

// --- Error Schemas for Storage Operations ---

export const BucketNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
    message: z.literal("The specified bucket binding was not found or is not configured."),
    bucketNameAttempted: z.string().optional().openapi({ example: 'INVALID_BUCKET_NAME' })
}).openapi('BucketNotFoundError');

export const ObjectNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
    message: z.literal("The requested object was not found in the specified bucket."),
    objectKeyAttempted: z.string().optional().openapi({ example: 'non/existent/object.txt' }),
    bucketQueried: R2BucketNameSchema.optional()
}).openapi('ObjectNotFoundError');

export const FileUploadErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.string().openapi({ example: 'File upload failed. No file provided in the \'file\' field or invalid form data.' })
}).openapi('FileUploadError');

export const R2OperationErrorSchema = GeneralServerErrorSchema.extend({
    message: z.string().openapi({ example: 'An error occurred while interacting with R2 storage.' }),
    details: z.string().optional().openapi({ example: 'R2 put operation failed due to an internal R2 error.' })
}).openapi('R2OperationError');

export const InvalidKeyErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Invalid object key provided. Keys cannot be empty or excessively long, and should follow R2 naming guidelines.")
}).openapi('InvalidKeyError');

export const InvalidCustomMetadataErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Invalid customMetadata. Must be a valid JSON string representing an object.")
}).openapi('InvalidCustomMetadataError');

export const MissingContentTypeErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Content-Type could not be determined for the file and was not provided.")
}).openapi('MissingContentTypeError');
