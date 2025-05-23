import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ExternalTaskSchema } from '../../schemas/externalTaskSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const getExternalTaskByIdHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to get external task by ID:', id);

  // Placeholder for actual logic to fetch task by ID
  // 1. Fetch task from database

  // Simulate success / not found
  if (id === 1) { // Assuming task with ID 1 exists for mock
    const placeholderTask = ExternalTaskSchema.parse({
      id: id,
      podcast_id: 456,
      task_type: 'video_generation_request',
      status: 'completed',
      payload: { script: 'some script', voice: 'alloy' },
      result: { videoUrl: 's3://bucket/generated.mp4', duration: 120 },
      external_service_id: 'gen-job-456',
      attempts: 1,
      last_attempted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return c.json({ success: true, task: placeholderTask }, 200);
  }
  throw new HTTPException(404, { message: 'External task not found.' });
};
