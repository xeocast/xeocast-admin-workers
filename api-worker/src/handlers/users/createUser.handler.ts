import { Context } from 'hono';
import { hash } from 'bcryptjs';
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

  const { email, name, password } = validationResult.data;

  try {
    // 1. Check if email already exists
    const existingUserByEmail = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?1')
      .bind(email)
      .first<{ id: number }>();

    if (existingUserByEmail) {
      return c.json(UserEmailExistsErrorSchema.parse({ success: false, message: 'A user with this email already exists.', error: 'email_exists' }), 400);
    }

    // 3. Hash password securely.
    const saltRounds = 12;
    const password_hash = await hash(password, saltRounds); 

    // 3. Store user in the database
    const stmt = c.env.DB.prepare(
      'INSERT INTO users (email, name, password_hash) VALUES (?1, ?2, ?3)'
    ).bind(email, name, password_hash);
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      const newUserId = result.meta.last_row_id;
      const editorRoleId = 2; // 'editor' role ID

      try {
        const userRoleStmt = c.env.DB.prepare(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?1, ?2)'
        ).bind(newUserId, editorRoleId);
        const userRoleResult = await userRoleStmt.run();

        if (!userRoleResult.success) {
          console.error(`Failed to assign editor role to user ${newUserId}. D1 user_roles insert result:`, userRoleResult);
          // User creation itself was successful, so we proceed.
          // Depending on requirements, a more complex error handling/rollback might be needed here.
        }
      } catch (roleError) {
        console.error(`Error assigning editor role to user ${newUserId}:`, roleError);
        // Log and proceed as user creation was successful.
      }

      return c.json(UserCreateResponseSchema.parse({
        success: true,
        message: 'User created successfully.',
        id: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert user, D1 result:', result);
      // This could be a D1 error or the unique constraint on email if not caught above (race condition)
      return c.json(UserCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create user.' }), 500);
    }

  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error) {
        if (error.message.includes('UNIQUE constraint failed: users.email')) {
            return c.json(UserEmailExistsErrorSchema.parse({ success: false, message: 'A user with this email already exists.', error: 'email_exists' }), 400);
        }

    }
    return c.json(UserCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create user due to a server error.' }), 500);
  }
};
