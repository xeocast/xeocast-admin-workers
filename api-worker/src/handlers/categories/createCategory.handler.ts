import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { CategoryCreateRequestSchema } from '../../schemas/categorySchemas';

export const createCategoryHandler = async (c: Context) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = CategoryCreateRequestSchema.safeParse(body);

  if (!validationResult.success) {
    console.error('Create category validation error:', validationResult.error.flatten());
    // Consider more specific error messages based on validationResult.error
    throw new HTTPException(400, { message: 'Invalid input for creating category.', cause: validationResult.error });
  }

  const { name, language_code } = validationResult.data;
  console.log('Attempting to create category:', { name, language_code });

  // Placeholder for actual category creation logic
  // 1. Check if category name already exists for the language
  // 2. Store category in the database

  // Simulate success for now
  const mockCategoryId = Math.floor(Math.random() * 1000) + 1;
  return c.json({ success: true, message: 'Category created successfully.' as const, categoryId: mockCategoryId }, 201);
};
