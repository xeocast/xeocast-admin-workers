import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserSchema } from '../../schemas/userSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const getUserByIdHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to get user by ID:', id);

  // Placeholder for actual logic to fetch user by ID
  // 1. Fetch user from database

  // Simulate success / not found
  if (id === 1) {
    const placeholderUser = UserSchema.parse({
      id: id,
      email: 'founduser@example.com',
      name: 'Found User',
      role_id: 2,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return c.json({ success: true, user: placeholderUser }, 200);
  }
  throw new HTTPException(404, { message: 'User not found.' });
};
