import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const deleteSeriesHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to delete series ID:', id);

  // Placeholder for actual series deletion logic
  // 1. Find series by ID
  // 2. Check if the series has any associated podcasts (deletion constraint)
  // 3. Delete series from the database

  // Simulate success / not found / constraint violation
  if (id === 1) { // Assuming series with ID 1 exists for mock
    // if (id === 2) { // Simulate series has podcasts
    //   throw new HTTPException(400, { message: 'Cannot delete series: It has associated podcasts.' });
    // }
    return c.json({ success: true, message: 'Series deleted successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'Series not found.' });
};
