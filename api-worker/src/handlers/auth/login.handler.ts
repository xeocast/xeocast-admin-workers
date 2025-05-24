import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { setCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs'; // For password hashing, as in old code
// crypto.randomUUID() will be used for session tokens, no specific import needed.
import { LoginRequestSchema } from '../../schemas/authSchemas';

// Define types for DB results
interface UserRecord {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
}

interface RoleRecord {
  role: string;
}

export const loginHandler = async (c: Context) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = LoginRequestSchema.safeParse(body);

  if (!validationResult.success) {
    console.error('Login validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Missing email or password.', cause: validationResult.error });
  }

  const { email, password } = validationResult.data;

  console.log('Login attempt with:', { email });

  // Actual login logic starts here
  const db = c.env.DB as D1Database; // Ensure DB is correctly typed in your Env (e.g., via src/env.d.ts)
  const environment = (c.env.ENVIRONMENT as string) || 'development'; // Ensure ENVIRONMENT is in your Env

  try {
    // Step 1: Fetch user by email
    const userStmt = db.prepare('SELECT id, email, password_hash, name FROM users WHERE email = ?');
    const userResult = await userStmt.bind(email).first<UserRecord>();

    if (!userResult) {
      console.error(`User not found for email: ${email}`);
      throw new HTTPException(401, { message: 'Invalid email or password.' });
    }

    // Step 2: Verify password
    const validPassword = await bcrypt.compare(password, userResult.password_hash);
    if (!validPassword) {
      console.error(`Password validation failed for user: ${userResult.email}`);
      throw new HTTPException(401, { message: 'Invalid email or password.' });
    }

    // Step 3: Fetch user role
    const roleStmt = db.prepare('SELECT r.name as role FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ?');
    const roleResult = await roleStmt.bind(userResult.id).first<RoleRecord>();

    if (!roleResult || !roleResult.role) {
      console.error(`Role not found for user ID: ${userResult.id}`);
      throw new HTTPException(500, { message: 'User role configuration error. Please contact support.' });
    }

    // Step 4: Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000); // 1 day

    const sessionStmt = db.prepare('INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)');
    await sessionStmt.bind(userResult.id, sessionToken, expiresAt.toISOString()).run();

    // Set session token in cookie
    setCookie(c, 'session_token', sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
      secure: environment === 'production',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return c.json({ success: true, message: 'Login successful' }, 200);

  } catch (e: any) {
    if (e instanceof HTTPException && (e.status === 400 || e.status === 401)) {
      // For expected client errors (400, 401), log a more concise message.
      // The specific reason (e.g., "User not found") was logged before throwing.
      console.error(`Client error during login: ${e.status} - ${e.message}`);
    } else {
      // For other HTTPExceptions (e.g., 500) or unexpected errors, log the full error.
      console.error("Error during login process:", e);
    }

    if (e instanceof HTTPException) {
      throw e; // Re-throw if already an HTTPException
    }
    // For other errors, wrap them in a generic 500 HTTPException
    throw new HTTPException(500, { message: e.message || 'An internal error occurred during login.' });
  }
};
