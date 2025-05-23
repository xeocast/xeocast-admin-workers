import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const deleteRoleHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to delete role ID:', id);

  // Placeholder for actual role deletion logic
  // 1. Find role by ID
  // 2. Check if the role is assigned to any users (deletion constraint)
  // 3. Delete role from the database

  // Simulate success / not found / constraint violation
  if (id === 1) { // Assuming role with ID 1 exists for mock
    // if (id === 2) { // Simulate role in use
    //   throw new HTTPException(400, { message: 'Cannot delete role: It is assigned to active users.' });
    // }
    return c.json({ success: true, message: 'Role deleted successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'Role not found.' });
};
