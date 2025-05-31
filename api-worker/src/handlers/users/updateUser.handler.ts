import { Context } from 'hono';
import { hash } from 'bcryptjs';
import type { CloudflareEnv } from '../../env';
import {
  UserUpdateRequestSchema,
  UserUpdateResponseSchema,
  UserUpdateFailedErrorSchema,
  UserNotFoundErrorSchema,
  UserEmailExistsErrorSchema
} from '../../schemas/userSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const updateUserHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(UserUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = UserUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(UserUpdateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for updating user.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { username, email, password, first_name, last_name, bio, profile_picture_url } = validationResult.data;

  if (Object.keys(validationResult.data).length === 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'No update data provided.' }), 400);
  }

  try {
    // 1. Check if user exists
    const userToUpdate = await c.env.DB.prepare('SELECT user_id, email, username FROM users WHERE user_id = ?1')
      .bind(id)
      .first<{ user_id: number; email: string; username: string }>();

    if (!userToUpdate) {
      return c.json(UserNotFoundErrorSchema.parse({ success: false, message: 'User not found.' }), 404);
    }

    // 2. If email is being changed, check if the new email already exists for another user
    if (email && email !== userToUpdate.email) {
      const existingUserWithNewEmail = await c.env.DB.prepare('SELECT user_id FROM users WHERE email = ?1 AND user_id != ?2')
        .bind(email, id)
        .first<{ user_id: number }>();
      if (existingUserWithNewEmail) {
        return c.json(UserEmailExistsErrorSchema.parse({ success: false, message: 'This email is already in use by another user.', error: 'email_exists' }), 400);
      }
    }

    // 3. If username is being changed, check if the new username already exists for another user
    if (username && username !== userToUpdate.username) {
      const existingUserWithNewUsername = await c.env.DB.prepare('SELECT user_id FROM users WHERE username = ?1 AND user_id != ?2')
        .bind(username, id)
        .first<{ user_id: number }>();
      if (existingUserWithNewUsername) {
        // Consider creating a specific UserUsernameExistsErrorSchema
        return c.json(UserUpdateFailedErrorSchema.parse({ success: false, message: 'This username is already in use by another user.' }), 400);
      }
    }

    // 4. Construct dynamic UPDATE statement
    const updateFields: string[] = [];
    const bindings: (string | number | null)[] = [];
    let bindingIndex = 1;

    if (username !== undefined) { updateFields.push(`username = ?${bindingIndex++}`); bindings.push(username); }
    if (email !== undefined) { updateFields.push(`email = ?${bindingIndex++}`); bindings.push(email); }
    if (first_name !== undefined) { updateFields.push(`first_name = ?${bindingIndex++}`); bindings.push(first_name); }
    if (last_name !== undefined) { updateFields.push(`last_name = ?${bindingIndex++}`); bindings.push(last_name); }
    if (bio !== undefined) { updateFields.push(`bio = ?${bindingIndex++}`); bindings.push(bio); }
    if (profile_picture_url !== undefined) { updateFields.push(`profile_picture_url = ?${bindingIndex++}`); bindings.push(profile_picture_url); }
    if (password !== undefined) {
      // Hash password securely.
      const saltRounds = 12;
      const password_hash = await hash(password, saltRounds);
      updateFields.push(`password_hash = ?${bindingIndex++}`); 
      bindings.push(password_hash); 
    }

    if (updateFields.length === 0) {
      // This case should ideally be caught by the initial check for empty data,
      // but as a safeguard, if all fields were undefined (which UserUpdateRequestSchema allows due to .partial()),
      // we can return a success or a specific message.
      return c.json(UserUpdateResponseSchema.parse({ success: true, message: 'No changes applied to the user.' }), 200);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?${bindingIndex}`;
    bindings.push(id);

    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(UserUpdateResponseSchema.parse({ success: true, message: 'User updated successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // User existed, but no fields were actually different from current values
      return c.json(UserUpdateResponseSchema.parse({ success: true, message: 'No changes applied to the user as the provided data was the same.' }), 200);
    } else {
      // This could be a D1 error or a unique constraint violation if not caught earlier (race condition for email)
      console.error('Failed to update user, D1 result:', result);
      return c.json(UserUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update user.' }), 500);
    }

  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error) {
        if (error.message.includes('UNIQUE constraint failed: users.email')) {
            return c.json(UserEmailExistsErrorSchema.parse({ success: false, message: 'This email is already in use by another user.', error: 'email_exists' }), 400);
        }
        if (error.message.includes('UNIQUE constraint failed: users.username')) {
            // Consider creating a specific UserUsernameExistsErrorSchema
            return c.json(UserUpdateFailedErrorSchema.parse({ success: false, message: 'This username is already in use by another user.' }), 400);
        }
    }
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to update user due to a server error.' }), 500);
  }
};
