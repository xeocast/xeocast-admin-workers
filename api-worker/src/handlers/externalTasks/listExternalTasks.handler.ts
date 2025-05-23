import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ExternalTaskSchema, ListExternalTasksQuerySchema, ListExternalTasksResponseSchema } from '../../schemas/externalTaskSchemas';
import { PaginationInfoSchema } from '../../schemas/commonSchemas';
import { z } from 'zod';

export const listExternalTasksHandler = async (c: Context) => {
  const queryParseResult = ListExternalTasksQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    throw new HTTPException(400, { message: 'Invalid query parameters.', cause: queryParseResult.error });
  }

  const { page = 1, limit = 10, task_type, status, podcast_id } = queryParseResult.data;
  console.log('Listing external tasks with query:', { page, limit, task_type, status, podcast_id });

  // Placeholder for actual task listing logic
  // 1. Fetch tasks from database, applying filters and pagination

  // Simulate success with mock data
  const placeholderTask = ExternalTaskSchema.parse({
    id: 1,
    podcast_id: podcast_id || 123,
    task_type: task_type || 'youtube_upload_request',
    status: status || 'pending',
    payload: { videoFile: 'video.mp4', title: 'Sample Video' },
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
    totalItems: 1, // Placeholder, replace with actual count
    totalPages: Math.ceil(1 / limit), // Placeholder
  });

  const responsePayload: z.infer<typeof ListExternalTasksResponseSchema> = { success: true, tasks: [placeholderTask], pagination };
  return c.json(responsePayload, 200);
};
