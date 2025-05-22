// src/routes/externalTasks.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  ExternalTaskCreateRequestSchema,
  ExternalTaskCreateResponseSchema,
  ListExternalTasksQuerySchema,
  ListExternalTasksResponseSchema,
  GetExternalTaskResponseSchema,
  ExternalTaskUpdateRequestSchema,
  ExternalTaskUpdateResponseSchema,
  ExternalTaskDeleteResponseSchema,
  ExternalTaskSchema,
  ExternalTaskCreateFailedErrorSchema,
  ExternalTaskNotFoundErrorSchema,
  ExternalTaskUpdateFailedErrorSchema,
  ExternalTaskDeleteFailedErrorSchema
} from '../schemas/externalTaskSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, PaginationInfoSchema } from '../schemas/commonSchemas';

const externalTaskRoutes = new OpenAPIHono();

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
externalTaskRoutes.openapi(createTaskRouteDef, (c) => {
  const newTaskData = c.req.valid('json');
  console.log('Create external task:', newTaskData);
  const createdTaskId = Math.floor(Math.random() * 10000) + 1;
  return c.json({ success: true, message: 'External task created successfully.' as const, taskId: createdTaskId }, 201);
});

// GET /external-tasks - List External Tasks
const listTasksRouteDef = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: ListExternalTasksQuerySchema,
  },
  responses: {
    200: { content: { 'application/json': { schema: ListExternalTasksResponseSchema } }, description: 'Paginated list of external tasks' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all external tasks with pagination and filtering.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(listTasksRouteDef, (c) => {
  const { page, limit, task_type, status, podcast_id } = c.req.valid('query');
  console.log('List external tasks - Query Params:', { page, limit, task_type, status, podcast_id });

  const placeholderTask = ExternalTaskSchema.parse({
    id: 1,
    podcast_id: 123,
    task_type: 'youtube_upload_request',
    status: 'pending',
    payload: { videoFile: 'video.mp4' },
    result: null,
    external_service_id: null,
    attempts: 0,
    last_attempted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const pagination = PaginationInfoSchema.parse({
    page: page,
    limit: limit,
    totalItems: 1, // Placeholder
    totalPages: 1, // Placeholder
  });

  const responsePayload = { success: true, tasks: [placeholderTask], pagination };
  return c.json(ListExternalTasksResponseSchema.parse(responsePayload), 200);
});

// GET /external-tasks/{id} - Get External Task by ID
const getTaskByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetExternalTaskResponseSchema } }, description: 'External task details' },
    404: { content: { 'application/json': { schema: ExternalTaskNotFoundErrorSchema } }, description: 'External task not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets an external task by ID.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(getTaskByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Get external task by ID:', id);
  if (id === '99999') { // Simulate not found
    return c.json(ExternalTaskNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'External task not found.' }), 404);
  }
  const placeholderTask = ExternalTaskSchema.parse({
    id: parseInt(id),
    podcast_id: 456,
    task_type: 'video_generation_request',
    status: 'completed',
    payload: { script: 'some script' },
    result: { videoUrl: 's3://bucket/generated.mp4' },
    external_service_id: 'gen-job-456',
    attempts: 1,
    last_attempted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return c.json({ success: true, task: placeholderTask }, 200);
});

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
    400: { content: { 'application/json': { schema: ExternalTaskUpdateFailedErrorSchema } }, description: 'Invalid input' },
    404: { content: { 'application/json': { schema: ExternalTaskNotFoundErrorSchema } }, description: 'External task not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates an existing external task.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(updateTaskRouteDef, (c) => {
  const { id } = c.req.valid('param');
  const updatedTaskData = c.req.valid('json');
  console.log('Update external task:', id, updatedTaskData);
  if (id === '99999') { // Simulate not found
    return c.json(ExternalTaskNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'External task not found.' }), 404);
  }
  return c.json({ success: true, message: 'External task updated successfully.' as const }, 200);
});

// DELETE /external-tasks/{id} - Delete External Task
const deleteTaskRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: ExternalTaskDeleteResponseSchema } }, description: 'External task deleted' },
    400: { content: { 'application/json': { schema: ExternalTaskDeleteFailedErrorSchema } }, description: 'Deletion failed' },
    404: { content: { 'application/json': { schema: ExternalTaskNotFoundErrorSchema } }, description: 'External task not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes an external task.',
  tags: ['ExternalTasks'],
});
externalTaskRoutes.openapi(deleteTaskRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Delete external task:', id);
  if (id === '99999') { // Simulate not found
    return c.json(ExternalTaskNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'External task not found.' }), 404);
  }
  // if (id === '1' && some_condition_for_delete_failure) { // Simulate constraint error
  //   return c.json(ExternalTaskDeleteFailedErrorSchema.parse({ success: false, error: 'delete_failed', message: 'Cannot delete task: It is currently processing.' }), 400);
  // }
  return c.json({ success: true, message: 'External task deleted successfully.' as const }, 200);
});

export default externalTaskRoutes;
