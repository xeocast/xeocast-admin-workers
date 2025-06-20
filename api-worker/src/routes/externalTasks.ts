// src/routes/externalTasks.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env';
import {
  CreateExternalTaskSchema as ExternalTaskCreateRequestSchema,
  ExternalTaskCreateResponseSchema,
  ListExternalTasksQuerySchema,
  ListExternalTasksResponseSchema,
  GetExternalTaskResponseSchema,
  UpdateExternalTaskSchema as ExternalTaskUpdateRequestSchema,
  ExternalTaskUpdateResponseSchema,
  ExternalTaskDeleteResponseSchema,
  ExternalTaskCreateFailedErrorSchema
} from '../schemas/externalTaskSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, PaginationInfoSchema, GeneralBadRequestErrorSchema, GeneralNotFoundErrorSchema } from '../schemas/commonSchemas';
import { createExternalTaskHandler } from '../handlers/externalTasks/createExternalTask.handler';
import { listExternalTasksHandler } from '../handlers/externalTasks/listExternalTasks.handler';
import { getExternalTaskByIdHandler } from '../handlers/externalTasks/getExternalTaskById.handler';
import { updateExternalTaskHandler } from '../handlers/externalTasks/updateExternalTask.handler';
import { deleteExternalTaskHandler } from '../handlers/externalTasks/deleteExternalTask.handler';

const externalTaskRoutes = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

// POST /external-tasks - Create External Task
const createTaskRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: ExternalTaskCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: ExternalTaskCreateResponseSchema } }, description: 'External task created' },
    400: { content: { 'application/json': { schema: ExternalTaskCreateFailedErrorSchema } }, description: 'Invalid input' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Creates a new external task.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(createTaskRouteDef, createExternalTaskHandler);

// GET /external-tasks - List External Tasks
const listTasksRouteDef = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: ListExternalTasksQuerySchema, // ListExternalTasksQuerySchema already includes sortBy and sortOrder with OpenAPI descriptions
  },
  responses: {
    200: { content: { 'application/json': { schema: ListExternalTasksResponseSchema } }, description: 'Paginated list of external tasks' },
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Bad request' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all external tasks with pagination and filtering.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(listTasksRouteDef, listExternalTasksHandler);

// GET /external-tasks/{id} - Get External Task by ID
const getTaskByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetExternalTaskResponseSchema } }, description: 'External task details' },
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Bad request' },
    404: { content: { 'application/json': { schema: GeneralNotFoundErrorSchema } }, description: 'External task not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets an external task by ID.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(getTaskByIdRouteDef, getExternalTaskByIdHandler);

// PUT /external-tasks/{id} - Update External Task
const updateTaskRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: ExternalTaskUpdateRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: ExternalTaskUpdateResponseSchema } }, description: 'External task updated' },
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Invalid input' },
    404: { content: { 'application/json': { schema: GeneralNotFoundErrorSchema } }, description: 'External task not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates an existing external task.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(updateTaskRouteDef, updateExternalTaskHandler);

// DELETE /external-tasks/{id} - Delete External Task
const deleteTaskRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: ExternalTaskDeleteResponseSchema } }, description: 'External task deleted' },
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Deletion failed' },
    404: { content: { 'application/json': { schema: GeneralNotFoundErrorSchema } }, description: 'External task not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes an external task.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(deleteTaskRouteDef, deleteExternalTaskHandler);

export default externalTaskRoutes;
