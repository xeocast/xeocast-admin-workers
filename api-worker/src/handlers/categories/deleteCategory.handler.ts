import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const deleteCategoryHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to delete category ID:', id);

  // Placeholder for actual category deletion logic
  // 1. Find category by ID
  // 2. Check for dependencies (e.g., podcasts in this category)
  // 3. Delete category from the database (or mark as deleted)

  // Simulate success / not found
  if (id === 1) { // Assuming category with ID 1 exists for mock
    return c.json({ success: true, message: 'Category deleted successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'Category not found.' });
};
