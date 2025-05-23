import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const deleteExternalTaskHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to delete external task ID:', id);

  // Placeholder for actual task deletion logic
  // 1. Find task by ID
  // 2. Check if task can be deleted (e.g., not in a non-terminal state like 'processing')
  // 3. Delete task from the database

  // Simulate success / not found / constraint violation
  if (id === 1) { // Assuming task with ID 1 exists for mock
    // if (id === 2) { // Simulate task is processing
    //   throw new HTTPException(400, { message: 'Cannot delete task: It is currently processing.' });
    // }
    return c.json({ success: true, message: 'External task deleted successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'External task not found.' });
};
