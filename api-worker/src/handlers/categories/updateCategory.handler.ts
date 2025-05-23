import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { CategoryUpdateRequestSchema } from '../../schemas/categorySchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const updateCategoryHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());
  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);

  const body = await c.req.json().catch(() => null);
  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = CategoryUpdateRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('Update category validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for updating category.', cause: validationResult.error });
  }

  const updateData = validationResult.data;
  console.log('Attempting to update category ID:', id, 'with data:', updateData);

  // Placeholder for actual category update logic
  // 1. Find category by ID
  // 2. If name is being changed, check if the new name already exists for the language
  // 3. Update category in the database

  // Simulate success / not found
  if (id === 1) { // Assuming category with ID 1 exists for mock
    return c.json({ success: true, message: 'Category updated successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'Category not found.' });
};
