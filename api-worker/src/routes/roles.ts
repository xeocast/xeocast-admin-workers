// src/routes/roles.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  RoleCreateRequestSchema,
  RoleCreateResponseSchema,
  ListRolesResponseSchema,
  GetRoleResponseSchema,
  RoleUpdateRequestSchema,
  RoleUpdateResponseSchema,
  RoleDeleteResponseSchema,
  RoleSchema,
  RoleNameExistsErrorSchema,
  RoleCreateFailedErrorSchema,
  RoleNotFoundErrorSchema,
  RoleUpdateFailedErrorSchema,
  RoleDeleteFailedErrorSchema
} from '../schemas/roleSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../schemas/commonSchemas';

const roleRoutes = new OpenAPIHono();

// POST /roles - Create Role
const createRoleRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: RoleCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: RoleCreateResponseSchema } }, description: 'Role created' },
    400: { content: { 'application/json': { schema: z.union([RoleNameExistsErrorSchema, RoleCreateFailedErrorSchema]) } }, description: 'Invalid input or role name exists' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Creates a new role.',
  tags: ['Roles'],
});
roleRoutes.openapi(createRoleRouteDef, (c) => {
  const newRoleData = c.req.valid('json');
  console.log('Create role:', newRoleData);
  // Placeholder: Actual role creation logic here
  const createdRoleId = Math.floor(Math.random() * 1000) + 1;
  return c.json({ success: true, message: 'Role created successfully.' as const, roleId: createdRoleId }, 201);
});

// GET /roles - List Roles
const listRolesRouteDef = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: { content: { 'application/json': { schema: ListRolesResponseSchema } }, description: 'List of roles' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all roles.',
  tags: ['Roles'],
});
roleRoutes.openapi(listRolesRouteDef, (c) => {
  console.log('List roles');
  // Placeholder: Actual role listing logic here
  const placeholderRole = RoleSchema.parse({
    id: 1,
    name: 'Administrator',
    description: 'Full access',
    permissions: ['manage_users', 'manage_settings'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const responsePayload = { success: true, roles: [placeholderRole] };
  return c.json(ListRolesResponseSchema.parse(responsePayload), 200);
});

// GET /roles/{id} - Get Role by ID
const getRoleByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetRoleResponseSchema } }, description: 'Role details' },
    404: { content: { 'application/json': { schema: RoleNotFoundErrorSchema } }, description: 'Role not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets a role by ID.',
  tags: ['Roles'],
});
roleRoutes.openapi(getRoleByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Get role by ID:', id);
  // Placeholder: Actual role retrieval logic here
  if (id === '999') { // Simulate not found
    return c.json(RoleNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'Role not found.' }), 404);
  }
  const placeholderRole = RoleSchema.parse({
    id: parseInt(id),
    name: 'Editor',
    description: 'Can edit content',
    permissions: ['edit_articles', 'publish_articles'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return c.json({ success: true, role: placeholderRole }, 200);
});

// PUT /roles/{id} - Update Role
const updateRoleRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: RoleUpdateRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: RoleUpdateResponseSchema } }, description: 'Role updated' },
    400: { content: { 'application/json': { schema: z.union([RoleNameExistsErrorSchema, RoleUpdateFailedErrorSchema]) } }, description: 'Invalid input or role name exists' },
    404: { content: { 'application/json': { schema: RoleNotFoundErrorSchema } }, description: 'Role not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates an existing role.',
  tags: ['Roles'],
});
roleRoutes.openapi(updateRoleRouteDef, (c) => {
  const { id } = c.req.valid('param');
  const updatedRoleData = c.req.valid('json');
  console.log('Update role:', id, updatedRoleData);
  // Placeholder: Actual role update logic here
  if (id === '999') { // Simulate not found
    return c.json(RoleNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'Role not found.' }), 404);
  }
  return c.json({ success: true, message: 'Role updated successfully.' as const }, 200);
});

// DELETE /roles/{id} - Delete Role
const deleteRoleRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: RoleDeleteResponseSchema } }, description: 'Role deleted' },
    400: { content: { 'application/json': { schema: RoleDeleteFailedErrorSchema } }, description: 'Deletion failed (e.g., role in use)' },
    404: { content: { 'application/json': { schema: RoleNotFoundErrorSchema } }, description: 'Role not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes a role.',
  tags: ['Roles'],
});
roleRoutes.openapi(deleteRoleRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Delete role:', id);
  // Placeholder: Actual role deletion logic here
  if (id === '999') { // Simulate not found
    return c.json(RoleNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'Role not found.' }), 404);
  }
  // Simulate deletion constraint failure
  // if (id === '1') { 
  //   return c.json(RoleDeleteFailedErrorSchema.parse({ success: false, error: 'delete_failed', message: 'Cannot delete role: It is assigned to active users.' }), 400);
  // }
  return c.json({ success: true, message: 'Role deleted successfully.' as const }, 200);
});

export default roleRoutes;
