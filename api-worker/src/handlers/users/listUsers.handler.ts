import { Context } from 'hono';
import { z } from 'zod';
import type { CloudflareEnv } from '../../env';
import {
  UserSchema,
  ListUsersResponseSchema
} from '../../schemas/userSchemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

// Schema for query parameters
const ListUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().default(1)).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().max(100).default(10)).optional(),
});

interface UserFromDB {
  id: number;
  email: string;
  name: string | null;
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

  const { page = 1, limit = 10 } = queryParseResult.data;
  const offset = (page - 1) * limit;

  try {
    // SELECT clause: Select user fields and the minimum role_id for each user.
    // Assumes 'status' column exists in 'users' table as per UserFromDB and schemas.
    let selectClause = 'SELECT u.id, u.email, u.name, u.created_at, u.updated_at';
    // FROM and JOIN clause: Join users with user_roles to access role information.
    let fromClause = 'FROM users u';
    
    const conditions: string[] = [];
    const bindings: (string | number)[] = [];
    let bindingIndex = 1;

    // GROUP BY clause: Ensure each user is listed once, even with multiple roles.
    // No GROUP BY needed if not aggregating roles
    let groupByClause = '';


    let query = selectClause + ' ' + fromClause;
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ' + groupByClause;
    query += ` ORDER BY u.email ASC LIMIT ?${bindingIndex} OFFSET ?${bindingIndex + 1}`;
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
