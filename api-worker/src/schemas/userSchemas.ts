// src/schemas/userSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  SimpleListResponseSchema
} from './commonSchemas';

// Base schema for user properties, used for creation and updates
const UserBaseSchema = z.object({
  username: z.string().min(3).max(50).openapi({ example: 'john.doe' }),
  email: z.string().email().max(255).openapi({ example: 'user@example.com' }),
  first_name: z.string().max(100).optional().nullable().openapi({ example: 'John' }),
  last_name: z.string().max(100).optional().nullable().openapi({ example: 'Doe' }),
  bio: z.string().max(1000).optional().nullable().openapi({ example: 'Loves coding and hiking.' }),
  profile_picture_url: z.string().url().max(2048).optional().nullable().openapi({ example: 'https://example.com/profile.jpg' }),
}).openapi('UserBase');

// Full User schema for API responses (excluding sensitive data like password_hash)
export const UserSchema = UserBaseSchema.extend({
  user_id: z.number().int().positive().openapi({ example: 1 }),
  is_active: z.boolean().openapi({ example: true }),
  is_verified: z.boolean().openapi({ example: false }),
  last_login_at: z.coerce.date().nullable().openapi({ example: '2023-01-15T10:30:00Z' }),
  failed_login_attempts: z.number().int().min(0).openapi({ example: 0 }),
  lockout_until: z.coerce.date().nullable().openapi({ example: null }),
  is_two_factor_enabled: z.boolean().openapi({ example: false }),
  created_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
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
// Schema for updating an existing user (all fields optional)
export const UserUpdateRequestSchema = UserBaseSchema.extend({
  // All fields from UserBaseSchema are already optional due to .partial() below
  // We only need to explicitly add password here if it's not in UserBaseSchema
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
