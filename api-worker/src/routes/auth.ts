// src/routes/auth.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  LoginRequestSchema,
  LoginSuccessResponseSchema,
  LoginMissingFieldsErrorSchema,
  LoginUserNotFoundErrorSchema,
  LoginInvalidPasswordErrorSchema,
  LoginRoleConfigErrorSchema,
  LoginInternalErrorSchema,
  LogoutSuccessResponseSchema,
  LogoutFailedErrorSchema,
} from '../schemas/authSchemas';
import { loginHandler } from '../handlers/auth/login.handler';
import { logoutHandler } from '../handlers/auth/logout.handler';

const authRoutes = new OpenAPIHono();

// POST /auth/login
const loginRouteDef = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginRequestSchema,
        },
      },
      description: 'User credentials for login.',
    },
  },
  responses: {
    200: {
      description: 'Login successful. Session cookie is set.',
      content: {
        'application/json': {
          schema: LoginSuccessResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad Request: Missing email or password.',
      content: {
        'application/json': {
          schema: LoginMissingFieldsErrorSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized: Invalid credentials, user not found, or role configuration issue.',
      content: {
        'application/json': {
          schema: z.union([
            LoginUserNotFoundErrorSchema,
            LoginInvalidPasswordErrorSchema,
            LoginRoleConfigErrorSchema,
          ]),
        },
      },
    },
    500: {
      description: 'Internal Server Error: An unexpected error occurred during the login process.',
      content: {
        'application/json': {
          schema: LoginInternalErrorSchema,
        },
      },
    },
  },
  summary: 'Logs in a user.',
  description: 'Logs in a user by verifying their email and password, and establishing a session.',
  tags: ['Authentication'],
});

authRoutes.openapi(loginRouteDef, loginHandler);


// POST /auth/logout
const logoutRouteDef = createRoute({
  method: 'post',
  path: '/logout',
  responses: {
    200: {
      description: 'Logout successful. Session cookie is cleared.',
      content: {
        'application/json': {
          schema: LogoutSuccessResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error: An unexpected error occurred during the logout process.',
      content: {
        'application/json': {
          schema: LogoutFailedErrorSchema,
        },
      },
    },
  },
  summary: 'Logs out a user.',
  description: 'Logs out the currently authenticated user by invalidating their session. Session is identified by a cookie.',
  tags: ['Authentication'],
});

authRoutes.openapi(logoutRouteDef, logoutHandler);

export default authRoutes;
