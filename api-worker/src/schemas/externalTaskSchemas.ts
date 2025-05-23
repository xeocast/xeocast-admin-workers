// src/schemas/externalTaskSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  PaginationQuerySchema,
  PaginatedResponseSchema
} from './commonSchemas';

// Enum for External Task status
export const ExternalTaskStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed'
]).openapi({ description: 'The current status of the external task.', example: 'pending' });

// Enum for External Task type
export const ExternalTaskTypeSchema = z.enum([
  'youtube_upload_request',
  'video_generation_request',
  'ai_content_generation',
  'webhook_processing'
  // Add other task types as needed
]).openapi({ description: 'The type of the external task.', example: 'youtube_upload_request' });

// Base schema for external task properties
const ExternalTaskBaseSchema = z.object({
  podcast_id: z.number().int().positive().nullable().optional()
    .openapi({ example: 1, description: 'ID of the podcast this task is related to, if any.' }),
  task_type: ExternalTaskTypeSchema,
  status: ExternalTaskStatusSchema.default('pending'),
  payload: z.any().nullable().optional() // Using z.any() for JSON object, consider a more specific schema if possible
    .openapi({ description: 'Payload/data required to execute the task.', example: { videoUrl: 's3://bucket/video.mp4' } }),
  result: z.any().nullable().optional() // Using z.any() for JSON object
    .openapi({ description: 'Result of the task execution.', example: { youtubeVideoId: 'xyz123' } }),
  external_service_id: z.string().max(255).nullable().optional()
    .openapi({ example: 'yt-upload-job-123', description: 'ID from the external service, if applicable.' }),
  attempts: z.number().int().nonnegative().default(0).optional()
    .openapi({ example: 0, description: 'Number of times this task has been attempted.' }),
  last_attempted_at: z.string().datetime().nullable().optional()
    .openapi({ example: '2023-01-01T13:00:00Z', description: 'Timestamp of the last attempt.' }),
}).openapi('ExternalTaskBase');

// Full ExternalTask schema for API responses
export const ExternalTaskSchema = ExternalTaskBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1, description: 'Unique identifier for the external task.' }),
  created_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of creation.' }),
  updated_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of last update.' }),
}).openapi('ExternalTask');

// Schema for creating a new external task
export const ExternalTaskCreateRequestSchema = ExternalTaskBaseSchema.omit({ attempts: true, last_attempted_at: true, status: true }); // status defaults to pending

export const ExternalTaskCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('External task created successfully.'),
  taskId: z.number().int().positive().openapi({ example: 101 }),
}).openapi('ExternalTaskCreateResponse');

// Schema for query parameters when listing external tasks
export const ListExternalTasksQuerySchema = PaginationQuerySchema.extend({
  task_type: ExternalTaskTypeSchema.optional()
    .openapi({ description: 'Filter by task type.' }),
  status: ExternalTaskStatusSchema.optional()
    .openapi({ description: 'Filter by task status.' }),
  podcast_id: z.string().optional() // Keep as string for query param, transform in handler if needed
    .transform(val => val ? parseInt(val, 10) : undefined)
    .pipe(z.number().int().positive().optional())
    .openapi({ description: 'Filter by podcast ID.', example: '1' }),
}).openapi('ListExternalTasksQuery');

// Schema for listing external tasks (paginated)
export const ListExternalTasksResponseSchema = PaginatedResponseSchema(ExternalTaskSchema, 'tasks');

// Schema for getting a single external task
export const GetExternalTaskResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  task: ExternalTaskSchema
}).openapi('GetExternalTaskResponse');

// Schema for updating an external task (e.g., status, result, attempts)
export const ExternalTaskUpdateRequestSchema = z.object({
  status: ExternalTaskStatusSchema.optional(),
  result: z.any().nullable().optional(),
  external_service_id: z.string().max(255).nullable().optional(),
  attempts: z.number().int().nonnegative().optional(),
  last_attempted_at: z.string().datetime().nullable().optional(),
  payload: z.any().nullable().optional(), // Sometimes payload might need an update too
}).partial().openapi('ExternalTaskUpdateRequest');

export const ExternalTaskUpdateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('External task updated successfully.')
}).openapi('ExternalTaskUpdateResponse');

// Schema for deleting an external task
export const ExternalTaskDeleteResponseSchema = MessageResponseSchema.extend({
  message: z.literal('External task deleted successfully.')
}).openapi('ExternalTaskDeleteResponse');

// --- Specific Error Schemas for External Tasks ---
export const ExternalTaskCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.literal('Failed to create external task.')
}).openapi('ExternalTaskCreateFailedError');

export const ExternalTaskUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.literal('Failed to update external task.')
}).openapi('ExternalTaskUpdateFailedError');

export const ExternalTaskDeleteFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.literal('Failed to delete external task.') // e.g. if task is processing and cannot be deleted
}).openapi('ExternalTaskDeleteFailedError');

export const ExternalTaskNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
  message: z.literal('External task not found.')
}).openapi('ExternalTaskNotFoundError');
