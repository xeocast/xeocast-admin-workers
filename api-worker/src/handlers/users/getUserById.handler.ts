import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  UserSchema,
  GetUserResponseSchema,
  UserNotFoundErrorSchema
} from '../../schemas/userSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';
import { z } from 'zod';

interface UserFromDB {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export const getUserByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    const dbUser = await c.env.DB.prepare(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?1'
    ).bind(id).first<UserFromDB>();

    if (!dbUser) {
      return c.json(UserNotFoundErrorSchema.parse({ success: false, message: 'User not found.' }), 404);
    }

    const userForValidation = {
      ...dbUser,
      name: dbUser.name === null ? undefined : dbUser.name,
    };

    const validation = UserSchema.safeParse(userForValidation);
    if (!validation.success) {
      console.error(`Data for user ID ${dbUser.id} failed UserSchema validation after DB fetch:`, validation.error.flatten());
      return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error processing user data.' }), 500);
    }

    return c.json(GetUserResponseSchema.parse({ success: true, user: validation.data }), 200);

  } catch (error) {
    console.error('Error getting user by ID:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to retrieve user due to a server error.' }), 500);
  }
};
