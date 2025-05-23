import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserUpdateRequestSchema } from '../../schemas/userSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const updateUserHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());
  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);

  const body = await c.req.json().catch(() => null);
  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = UserUpdateRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('Update user validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for updating user.', cause: validationResult.error });
  }

  const updateData = validationResult.data;
  console.log('Attempting to update user ID:', id, 'with data:', updateData);

  // Placeholder for actual user update logic
  // 1. Find user by ID
  // 2. If email is being changed, check if the new email already exists (for another user)
  // 3. Update user in the database

  // Simulate success / not found
  if (id === 1) { // Assuming user with ID 1 exists for mock
    return c.json({ success: true, message: 'User updated successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'User not found.' });
};
