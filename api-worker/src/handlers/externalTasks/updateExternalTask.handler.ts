import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ExternalTaskUpdateRequestSchema } from '../../schemas/externalTaskSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const updateExternalTaskHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());
  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);

  const body = await c.req.json().catch(() => null);
  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = ExternalTaskUpdateRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('Update external task validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for updating external task.', cause: validationResult.error });
  }

  const updateData = validationResult.data;
  console.log('Attempting to update external task ID:', id, 'with data:', updateData);

  // Placeholder for actual task update logic
  // 1. Find task by ID
  // 2. Update task in the database
  // 3. If status changed to 'pending' or 'retrying', potentially re-trigger async process

  // Simulate success / not found
  if (id === 1) { // Assuming task with ID 1 exists for mock
    return c.json({ success: true, message: 'External task updated successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'External task not found.' });
};
