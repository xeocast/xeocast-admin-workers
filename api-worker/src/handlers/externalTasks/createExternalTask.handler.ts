import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ExternalTaskCreateRequestSchema } from '../../schemas/externalTaskSchemas';

export const createExternalTaskHandler = async (c: Context) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = ExternalTaskCreateRequestSchema.safeParse(body);

  if (!validationResult.success) {
    console.error('Create external task validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for creating external task.', cause: validationResult.error });
  }

  const taskData = validationResult.data;
  console.log('Attempting to create external task with data:', taskData);

  // Placeholder for actual external task creation logic
  // 1. Validate podcast_id if provided
  // 2. Store task in the database
  // 3. Potentially trigger an async process based on task_type

  // Simulate success for now
  const mockTaskId = Math.floor(Math.random() * 10000) + 1;
  return c.json({ success: true, message: 'External task created successfully.' as const, taskId: mockTaskId }, 201);
};
