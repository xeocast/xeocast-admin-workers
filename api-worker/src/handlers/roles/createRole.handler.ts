import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { RoleCreateRequestSchema } from '../../schemas/roleSchemas';

export const createRoleHandler = async (c: Context) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = RoleCreateRequestSchema.safeParse(body);

  if (!validationResult.success) {
    console.error('Create role validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for creating role.', cause: validationResult.error });
  }

  const roleData = validationResult.data;
  console.log('Attempting to create role with data:', roleData);

  // Placeholder for actual role creation logic
  // 1. Check if role name already exists
  // 2. Store role in the database

  // Simulate success for now
  const mockRoleId = Math.floor(Math.random() * 1000) + 1;
  // Simulate role name exists error
  // if (roleData.name === 'existing_role_name') {
  //   throw new HTTPException(400, { message: 'Role name already exists.'});
  // }
  return c.json({ success: true, message: 'Role created successfully.' as const, roleId: mockRoleId }, 201);
};
