import { defineAction } from 'astro:actions';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const auth = {
  login: defineAction({
    accept: 'form',
    async handler(formData, { locals, cookies }) {
      const email = formData.get('email')?.toString() || '';
      const password = formData.get('password')?.toString() || '';

      if (!email || !password) {
        throw { error: 'missing' };
      }

      const db = locals.runtime.env.DB;
      
      try {
        // Step 1: Fetch user by email
        const userStmt = db.prepare('SELECT id, email, password_hash, name FROM users WHERE email = ?');
        const userResult = await userStmt.bind(email).first<{ id: number; email: string; password_hash: string; name: string | null }>();

        if (!userResult) {
          throw { error: 'invalid', message: 'User not found.' };
        }

        // Step 2: Verify password
        const validPassword = await bcrypt.compare(password, userResult.password_hash);
        if (!validPassword) {
          throw { error: 'invalid', message: 'Invalid password.' };
        }

        // Step 3: Fetch user role
        const roleStmt = db.prepare('SELECT r.name as role FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ?');
        const roleResult = await roleStmt.bind(userResult.id).first<{ role: string }>();

        if (!roleResult || !roleResult.role) {
            console.error(`Role not found for user ID: ${userResult.id}`);
            throw { error: 'authentication_failed', message: 'User role configuration error.' };
        }

        const user = {
            id: userResult.id,
            email: userResult.email,
            name: userResult.name || '', // Ensure name is a string
            role: roleResult.role
        };
        
        // Generate session token and expiry
        const sessionToken = uuidv4();
        const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000); // 1 day

        // Store session in database
        const sessionStmt = db.prepare('INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)');
        await sessionStmt.bind(user.id, sessionToken, expiresAt.toISOString()).run();

        // Set session token in cookie
        cookies.set('session_token', sessionToken, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: import.meta.env.PROD,
          maxAge: 60 * 60 * 24, // 1 day in seconds
        });

        // Do not return user data here; middleware will set it.
        return { success: true };

      } catch (e: any) {
        console.error("Error during login process:", e);
        // Ensure a structured error is thrown for the client
        if (e.error === 'invalid') {
             throw { error: 'invalid', message: e.message || 'Invalid email or password.' };
        }
        throw { error: 'authentication_failed', message: e.message || 'An internal error occurred during login.' };
      }
    },
  }),
	logout: defineAction({
		accept: 'form',
		async handler(_, { locals, cookies }) {
			const sessionToken = cookies.get('session_token')?.value;

			if (sessionToken) {
				try {
					const db = locals.runtime.env.DB;
					const stmt = db.prepare('DELETE FROM user_sessions WHERE session_token = ?');
					await stmt.bind(sessionToken).run();
				} catch (dbError) {
					console.error("Error deleting session from DB:", dbError);
					// Non-critical, proceed to delete cookie
				}
			}

			cookies.delete('session_token', { path: '/' });
			// Redirect handled by the client/page after action result
			return { success: true, message: 'Logged out successfully.' }; // Return success for client handling
		},
	}),
}; 