import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { LoginRequestSchema } from '../../schemas/authSchemas';

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

  // Placeholder for actual login logic
  // 1. Find user by email
  // 2. Verify password
  // 3. Check role configuration (if applicable)
  // 4. Create session (e.g., set a cookie)

  // Simulate success for now
  if (email === 'test@example.com' && password === 'password') {
    // In a real app, set a session cookie here.
    // Example: setCookie(c, 'session_id', 'your_session_token', { path: '/', httpOnly: true, secure: true, sameSite: 'Lax' });
    return c.json({ success: true, message: 'Login successful' }, 200);
  } else if (email !== 'test@example.com') {
    throw new HTTPException(401, { message: 'User not found.' });
  } else {
    throw new HTTPException(401, { message: 'Invalid password.' });
  }
};
