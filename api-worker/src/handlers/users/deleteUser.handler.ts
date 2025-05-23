import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const deleteUserHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to delete user ID:', id);

  // Placeholder for actual user deletion logic
  // 1. Find user by ID
  // 2. Delete user from the database (or mark as deleted)

  // Simulate success / not found
  if (id === 1) { // Assuming user with ID 1 exists for mock
    return c.json({ success: true, message: 'User deleted successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'User not found.' });
};
