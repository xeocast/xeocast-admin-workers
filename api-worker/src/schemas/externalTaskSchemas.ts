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
  'error'
]).openapi({ description: 'The current status of the external task.', example: 'pending' });

// Enum for External Task type
export const ExternalTaskTypeSchema = z.enum([
  'youtube_upload_request',
  'video_generation_request'
  // Add other task types as needed
]).openapi({ description: 'The type of the external task.', example: 'youtube_upload_request' });

// Base schema for external task properties
const ExternalTaskBaseSchema = z.object({
  external_task_id: z.string()
    .openapi({ example: 'ext-task-abc-123', description: 'The unique identifier for the task in an external system or context. This corresponds to external_task_id in the database.' }),
  type: ExternalTaskTypeSchema
    .openapi({ description: 'The type of the external task. This corresponds to type in the database.' }),
  data: z.any()
    .openapi({ description: 'Payload/data associated with the task, stored as a JSON string in the database. This corresponds to data in the database.', example: { videoUrl: 's3://bucket/video.mp4', title: 'My Video' } }),
  status: ExternalTaskStatusSchema
    .openapi({ description: 'The current status of the external task. This corresponds to status in the database.' }),
}).openapi('ExternalTaskBase');

// Full ExternalTask schema for API responses
export const ExternalTaskSchema = ExternalTaskBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1, description: 'Unique identifier for the external task record in our system.' }),
  created_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of creation.' }),
  updated_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of last update.' }),
}).openapi('ExternalTask');

// Schema for creating a new external task (input)
export const CreateExternalTaskSchema = z.object({
  external_task_id: z.string()
    .openapi({ example: 'ext-task-abc-123', description: 'The unique identifier for the task in an external system or context.' }),
  type: ExternalTaskTypeSchema,
  data: z.any()
    .openapi({ description: 'Payload/data associated with the task.', example: { videoUrl: 's3://bucket/video.mp4', title: 'My Video' } }),
  status: ExternalTaskStatusSchema.default('pending').optional()
    .openapi({ description: 'Optional status for the task on creation, defaults to pending.' }),
}).openapi('CreateExternalTask');

export const ExternalTaskCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('External task created successfully.'),
  id: z.number().int().positive().openapi({ example: 101 }),
}).openapi('ExternalTaskCreateResponse');

// Schema for query parameters when listing external tasks
// Enum for sortable fields for External Tasks
export const ExternalTaskSortBySchema = z.enum([
  'id',
  'external_task_id',
  'type',
  'status',
  'created_at',
  'updated_at'
]).openapi({ description: 'Field to sort external tasks by.', example: 'created_at' });

// Enum for sort order (re-defined here for locality, consider moving to commonSchemas if widely used)
export const SortOrderSchema = z.enum(['asc', 'desc']).openapi({ description: 'Sort order.', example: 'desc' });

export const ListExternalTasksQuerySchema = PaginationQuerySchema.extend({
  type: ExternalTaskTypeSchema.optional()
    .openapi({ description: 'Filter by task type.' }),
  status: ExternalTaskStatusSchema.optional()
    .openapi({ description: 'Filter by task status.' }),
  sortBy: ExternalTaskSortBySchema.optional().default('created_at')
    .openapi({ description: 'Field to sort by.', example: 'created_at' }),
  sortOrder: SortOrderSchema.optional().default('desc')
    .openapi({ description: 'Sort order (asc/desc).', example: 'desc' }),
}).openapi('ListExternalTasksQuery');

// Schema for listing external tasks (paginated)
export const ListExternalTasksResponseSchema = PaginatedResponseSchema(ExternalTaskSchema, 'tasks');

// Schema for getting a single external task
export const GetExternalTaskResponseSchema = z.object({
  task: ExternalTaskSchema
}).openapi('GetExternalTaskResponse');

// Schema for updating an existing external task (input)
// All fields from CreateExternalTaskSchema are made optional for updates.
export const UpdateExternalTaskSchema = CreateExternalTaskSchema.partial().openapi('UpdateExternalTask');

export const ExternalTaskUpdateResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'External task updated successfully.' })
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
