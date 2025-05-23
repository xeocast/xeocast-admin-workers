import { Context } from 'hono';
import { z } from 'zod';
import type { CloudflareEnv } from '../../env';
import {
  UserSchema,
  UserStatusSchema,
  ListUsersResponseSchema
} from '../../schemas/userSchemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

// Schema for query parameters
const ListUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().default(1)).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().max(100).default(10)).optional(),
  status: UserStatusSchema.optional(),
  role_id: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional(),
});

interface UserFromDB {
  id: number;
  email: string;
  name: string | null;
  role_id: number;
  status: z.infer<typeof UserStatusSchema>;
  created_at: string;
  updated_at: string;
}

export const listUsersHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListUsersQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        success: false, 
        message: 'Invalid query parameters.',
        // errors: queryParseResult.error.flatten().fieldErrors
    }), 400);
  }

  const { page = 1, limit = 10, status, role_id } = queryParseResult.data;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT id, email, name, role_id, status, created_at, updated_at FROM users';
    const conditions: string[] = [];
    const bindings: (string | number)[] = [];
    let bindingIndex = 1;

    if (status) {
      conditions.push(`status = ?${bindingIndex}`);
      bindings.push(status);
      bindingIndex++;
    }
    if (role_id !== undefined) {
      conditions.push(`role_id = ?${bindingIndex}`);
      bindings.push(role_id);
      bindingIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ` ORDER BY email ASC LIMIT ?${bindingIndex} OFFSET ?${bindingIndex + 1}`;
    bindings.push(limit, offset);

    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const { results } = await stmt.all<UserFromDB>();

    if (!results) {
      return c.json(ListUsersResponseSchema.parse({ success: true, users: [] }), 200);
    }

    const users = results.map(dbUser => {
      const validation = UserSchema.safeParse({
        ...dbUser,
        name: dbUser.name === null ? undefined : dbUser.name,
      });
      if (!validation.success) {
        console.warn(`Data for user ID ${dbUser.id} failed UserSchema validation:`, validation.error.flatten());
        return null; 
      }
      return validation.data;
    }).filter(u => u !== null) as z.infer<typeof UserSchema>[]; // Assert non-null after filter

    return c.json(ListUsersResponseSchema.parse({ success: true, users }), 200);
    // TODO: Add total count for pagination if ListUsersResponseSchema is updated

  } catch (error) {
    console.error('Error listing users:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to list users due to a server error.' }), 500);
  }
};
