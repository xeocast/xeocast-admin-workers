import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  UserCreateRequestSchema,
  UserCreateResponseSchema,
  UserCreateFailedErrorSchema,
  UserEmailExistsErrorSchema
} from '../../schemas/userSchemas';
import { GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas'; // For role not found

export const createUserHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(UserCreateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = UserCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(UserCreateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for creating user.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { email, name, role_id, status, password } = validationResult.data;

  try {
    // 1. Check if email already exists
    const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?1')
      .bind(email)
      .first<{ id: number }>();

    if (existingUser) {
      return c.json(UserEmailExistsErrorSchema.parse({ success: false, message: 'A user with this email already exists.', error: 'email_exists' }), 400);
    }

    // 2. Validate role_id
    const roleExists = await c.env.DB.prepare('SELECT id FROM roles WHERE id = ?1')
      .bind(role_id)
      .first<{ id: number }>();

    if (!roleExists) {
      return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Role not found.' }), 400);
    }

    // 3. TODO: Hash password securely. Storing plain text for now.
    const password_hash = password; 

    // 4. Store user in the database
    const stmt = c.env.DB.prepare(
      'INSERT INTO users (email, password_hash, name, status, role_id) VALUES (?1, ?2, ?3, ?4, ?5)'
    ).bind(email, password_hash, name, status || 'active', role_id);
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(UserCreateResponseSchema.parse({
        success: true,
        message: 'User created successfully.',
        userId: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert user, D1 result:', result);
      // This could be a D1 error or the unique constraint on email if not caught above (race condition)
      return c.json(UserCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create user.' }), 500);
    }

  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed: users.email')) {
        return c.json(UserEmailExistsErrorSchema.parse({ success: false, message: 'A user with this email already exists.', error: 'email_exists' }), 400);
    }
    return c.json(UserCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create user due to a server error.' }), 500);
  }
};
