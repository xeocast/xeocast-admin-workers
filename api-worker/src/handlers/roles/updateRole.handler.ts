import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { RoleUpdateRequestSchema } from '../../schemas/roleSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const updateRoleHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());
  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);

  const body = await c.req.json().catch(() => null);
  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = RoleUpdateRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('Update role validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for updating role.', cause: validationResult.error });
  }

  const updateData = validationResult.data;
  console.log('Attempting to update role ID:', id, 'with data:', updateData);

  // Placeholder for actual role update logic
  // 1. Find role by ID
  // 2. Check if new role name (if changed) already exists for another role
  // 3. Update role in the database

  // Simulate success / not found / name exists
  if (id === 1) { // Assuming role with ID 1 exists for mock
    // if (updateData.name === 'existing_role_name') {
    //   throw new HTTPException(400, { message: 'Role name already exists.'});
    // }
    return c.json({ success: true, message: 'Role updated successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'Role not found.' });
};
