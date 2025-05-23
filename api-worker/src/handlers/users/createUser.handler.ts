import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserCreateRequestSchema } from '../../schemas/userSchemas';

export const createUserHandler = async (c: Context) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = UserCreateRequestSchema.safeParse(body);

  if (!validationResult.success) {
    console.error('Create user validation error:', validationResult.error.flatten());
    // Consider more specific error messages based on validationResult.error
    throw new HTTPException(400, { message: 'Invalid input for creating user.', cause: validationResult.error });
  }

  const { email, name, role_id, status, password } = validationResult.data;
  console.log('Attempting to create user:', { email, name, role_id, status });

  // Placeholder for actual user creation logic
  // 1. Check if email already exists
  // 2. Hash password
  // 3. Store user in the database

  // Simulate success for now
  const mockUserId = Math.floor(Math.random() * 1000) + 1;
  return c.json({ success: true, message: 'User created successfully.' as const, userId: mockUserId }, 201);
};
