// src/schemas/authSchemas.ts
import { z } from '@hono/zod-openapi';
import { ErrorSchema, MessageResponseSchema } from './commonSchemas';

// POST /auth/login
export const LoginRequestSchema = z.object({
  email: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().min(1).openapi({ example: 'yourpassword' }),
}).openapi('LoginRequest');

export const LoginSuccessResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
}).openapi('LoginSuccessResponse');

export const LoginMissingFieldsErrorSchema = ErrorSchema.extend({
  error: z.literal('missing'),
  message: z.literal('Email and password are required.'),
}).openapi('LoginMissingFieldsError');

export const LoginUserNotFoundErrorSchema = ErrorSchema.extend({
  error: z.literal('invalid'),
  message: z.literal('User not found.'),
}).openapi('LoginUserNotFoundError');

export const LoginInvalidPasswordErrorSchema = ErrorSchema.extend({
  error: z.literal('invalid'),
  message: z.literal('Invalid password.'),
}).openapi('LoginInvalidPasswordError');

export const LoginRoleConfigErrorSchema = ErrorSchema.extend({
  error: z.literal('authentication_failed'),
  message: z.literal('User role configuration error.'),
}).openapi('LoginRoleConfigError');

export const LoginInternalErrorSchema = ErrorSchema.extend({
  error: z.literal('authentication_failed'),
  message: z.literal('An internal error occurred during login.'),
}).openapi('LoginInternalError');


// POST /auth/logout
export const LogoutSuccessResponseSchema = MessageResponseSchema.extend({
    message: z.literal('Logged out successfully.')
}).openapi('LogoutSuccessResponse');

export const LogoutFailedErrorSchema = ErrorSchema.extend({
  error: z.literal('logout_failed'),
  message: z.literal('An internal error occurred during logout.'),
}).openapi('LogoutFailedError');
