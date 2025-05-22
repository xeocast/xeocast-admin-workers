// src/routes/users.ts
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  UserSchema,
  UserCreateRequestSchema,
  UserCreateResponseSchema,
  ListUsersResponseSchema,
  GetUserResponseSchema,
  UserUpdateRequestSchema,
  UserUpdateResponseSchema,
  UserDeleteResponseSchema,
  UserNotFoundErrorSchema,
  UserCreateFailedErrorSchema,
  UserUpdateFailedErrorSchema,
  UserEmailExistsErrorSchema,
  UserStatusSchema
} from '../schemas/userSchemas';
import {
  PathIdParamSchema,
  GeneralServerErrorSchema
} from '../schemas/commonSchemas';

const userRoutes = new OpenAPIHono();

// POST /users - Create User
const createUserRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: { 'application/json': { schema: UserCreateRequestSchema } },
      description: 'Data for the new user.',
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: UserCreateResponseSchema } },
      description: 'User created successfully.',
    },
    400: {
      content: { 'application/json': { schema: UserCreateFailedErrorSchema } }, // Could also be UserEmailExistsErrorSchema
      description: 'Invalid input or user already exists.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Creates a new user.',
  tags: ['Users'],
});

userRoutes.openapi(createUserRouteDef, (c) => {
  // const body = c.req.valid('json');
  // Mock logic: if (body.email === 'exists@example.com') return c.json(UserEmailExistsErrorSchema.parse({ success: false, message: 'A user with this email already exists.', error: 'email_exists'}), 400);
  return c.json({ success: true, message: 'User created successfully.' as const, userId: Math.floor(Math.random() * 1000) + 1 }, 201);
});

// GET /users - List Users
const listUsersRouteDef = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: z.object({
      page: z.string().optional().openapi({ example: '1', description: 'Page number for pagination.' }),
      limit: z.string().optional().openapi({ example: '10', description: 'Number of items per page.' }),
      status: UserStatusSchema.optional().openapi({ description: 'Filter by user status.' }),
      role_id: z.string().optional().openapi({ description: 'Filter by role ID.' }),
    }).openapi('ListUsersQuery'),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ListUsersResponseSchema } },
      description: 'A list of users.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Lists all users.',
  tags: ['Users'],
});

userRoutes.openapi(listUsersRouteDef, (c) => {
  // const query = c.req.valid('query');
  const placeholderUser = UserSchema.parse({
    id: 1,
    email: 'user1@example.com',
    name: 'User One',
    role_id: 1,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const responsePayload = { success: true, users: [placeholderUser] };
  return c.json(ListUsersResponseSchema.parse(responsePayload), 200);
});

// GET /users/{id} - Get User by ID
const getUserByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetUserResponseSchema } },
      description: 'Details of the user.',
    },
    404: {
      content: { 'application/json': { schema: UserNotFoundErrorSchema } },
      description: 'User not found.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Gets a specific user by their ID.',
  tags: ['Users'],
});

userRoutes.openapi(getUserByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  if (id === '1') {
    const placeholderUser = UserSchema.parse({
      id: parseInt(id as string),
      email: 'founduser@example.com',
      name: 'Found User',
      role_id: 2,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return c.json({ success: true, user: placeholderUser }, 200);
  }
  return c.json(UserNotFoundErrorSchema.parse({ success: false, message: 'User not found.' }), 404);
});

// PUT /users/{id} - Update User
const updateUserRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: {
      content: { 'application/json': { schema: UserUpdateRequestSchema } },
      description: 'Data to update for the user.',
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: UserUpdateResponseSchema } },
      description: 'User updated successfully.',
    },
    400: {
      content: { 'application/json': { schema: UserUpdateFailedErrorSchema } }, // Or UserEmailExistsErrorSchema
      description: 'Invalid input or email already exists.',
    },
    404: {
      content: { 'application/json': { schema: UserNotFoundErrorSchema } },
      description: 'User not found.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Updates an existing user.',
  tags: ['Users'],
});

userRoutes.openapi(updateUserRouteDef, (c) => {
  const { id } = c.req.valid('param');
  // const body = c.req.valid('json');
  if (id === '1') {
    return c.json({ success: true, message: 'User updated successfully.' as const }, 200);
  }
  return c.json(UserNotFoundErrorSchema.parse({ success: false, message: 'User not found.' }), 404);
});

// DELETE /users/{id} - Delete User
const deleteUserRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: UserDeleteResponseSchema } },
      description: 'User deleted successfully.',
    },
    404: {
      content: { 'application/json': { schema: UserNotFoundErrorSchema } },
      description: 'User not found.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Deletes a user.',
  tags: ['Users'],
});

userRoutes.openapi(deleteUserRouteDef, (c) => {
  const { id } = c.req.valid('param');
  if (id === '1') {
    return c.json({ success: true, message: 'User deleted successfully.' as const }, 200);
  }
  return c.json(UserNotFoundErrorSchema.parse({ success: false, message: 'User not found.' }), 404);
});

export default userRoutes;
