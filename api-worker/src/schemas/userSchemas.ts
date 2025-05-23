// src/schemas/userSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  SimpleListResponseSchema
} from './commonSchemas';

// Enum for User status
export const UserStatusSchema = z.enum([
  'active',
  'invited',
  'suspended',
  'pending_verification'
]).openapi({ description: 'The current status of the user.', example: 'active' });

// Base schema for user properties, used for creation and updates
const UserBaseSchema = z.object({
  email: z.string().email().max(255).openapi({ example: 'user@example.com' }),
  name: z.string().max(255).optional().openapi({ example: 'John Doe' }),
  role_id: z.number().int().positive().openapi({ example: 1, description: 'ID of the role assigned to the user.' }),
  status: UserStatusSchema.default('active').optional(),
}).openapi('UserBase');

// Full User schema for API responses (excluding sensitive data like password_hash)
export const UserSchema = UserBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1 }),
  created_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z' }),
}).openapi('User');

// Schema for creating a new user
export const UserCreateRequestSchema = UserBaseSchema.extend({
  password: z.string().min(8).max(255).openapi({ example: 'SecurePassword123' }),
});

export const UserCreateResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'User created successfully.' }),
  userId: z.number().int().positive().openapi({ example: 101 }),
}).openapi('UserCreateResponse');

// Schema for listing users
export const ListUsersResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  users: z.array(UserSchema)
}).openapi('ListUsersResponse');

// Schema for getting a single user
export const GetUserResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  user: UserSchema,
}).openapi('GetUserResponse');

// Schema for updating an existing user (all fields optional)
export const UserUpdateRequestSchema = UserBaseSchema.extend({
    email: UserBaseSchema.shape.email.optional(),
    role_id: UserBaseSchema.shape.role_id.optional(),
    password: z.string().min(8).max(255).optional().openapi({ example: 'NewSecurePassword123', description: 'Only provide if changing the password.' }),
}).partial().openapi('UserUpdateRequest');

export const UserUpdateResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'User updated successfully.' }),
}).openapi('UserUpdateResponse');

// Schema for deleting a user
export const UserDeleteResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'User deleted successfully.' }),
}).openapi('UserDeleteResponse');

// Error Schemas specific to Users
export const UserNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
  message: z.string().openapi({ example: 'User not found.' }),
}).openapi('UserNotFoundError');

export const UserCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Failed to create user.' }),
  // errors: z.record(z.string()).optional().openapi({ example: { email: 'Invalid email format' } })
}).openapi('UserCreateFailedError');

export const UserUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Failed to update user.' }),
}).openapi('UserUpdateFailedError');

export const UserEmailExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.string().openapi({ example: 'A user with this email already exists.' }),
    error: z.literal('email_exists').optional()
}).openapi('UserEmailExistsError');
