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
  user_id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  is_active: boolean | number; // D1 might return 0/1 for boolean
  is_verified: boolean | number;
  last_login_at: string | null;
  failed_login_attempts: number;
  lockout_until: string | null;
  is_two_factor_enabled: boolean | number;
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
      'SELECT user_id, username, email, first_name, last_name, bio, profile_picture_url, is_active, is_verified, last_login_at, failed_login_attempts, lockout_until, is_two_factor_enabled, created_at, updated_at FROM users WHERE user_id = ?1'
    ).bind(id).first<UserFromDB>();

    if (!dbUser) {
      return c.json(UserNotFoundErrorSchema.parse({ success: false, message: 'User not found.' }), 404);
    }

    const userForValidation = {
      ...dbUser,
      // Ensure boolean fields are actual booleans for Zod validation if D1 returns 0/1
      is_active: !!dbUser.is_active,
      is_verified: !!dbUser.is_verified,
      is_two_factor_enabled: !!dbUser.is_two_factor_enabled,
      // Convert nulls to undefined where schema expects optional (or keep as null if schema expects nullable)
      first_name: dbUser.first_name,
      last_name: dbUser.last_name,
      bio: dbUser.bio,
      profile_picture_url: dbUser.profile_picture_url,
      last_login_at: dbUser.last_login_at,
      lockout_until: dbUser.lockout_until,
    };

    const validation = UserSchema.safeParse(userForValidation);
    if (!validation.success) {
      console.error(`Data for user ID ${dbUser.user_id} failed UserSchema validation after DB fetch:`, validation.error.flatten());
      return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error processing user data.' }), 500);
    }

    return c.json(GetUserResponseSchema.parse({ success: true, user: validation.data }), 200);

  } catch (error) {
    console.error('Error getting user by ID:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to retrieve user due to a server error.' }), 500);
  }
};
