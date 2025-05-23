import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SeriesUpdateRequestSchema } from '../../schemas/seriesSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const updateSeriesHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());
  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);

  const body = await c.req.json().catch(() => null);
  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = SeriesUpdateRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('Update series validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for updating series.', cause: validationResult.error });
  }

  const updateData = validationResult.data;
  console.log('Attempting to update series ID:', id, 'with data:', updateData);

  // Placeholder for actual series update logic
  // 1. Find series by ID
  // 2. Validate category_id if changed
  // 3. Check if new series title (if changed) already exists within the same category_id for another series
  // 4. Update series in the database

  // Simulate success / not found / title exists error
  if (id === 1) { // Assuming series with ID 1 exists for mock
    // if (updateData.title === 'existing_series_title' && updateData.category_id === 1) {
    //   throw new HTTPException(400, { message: 'Series title already exists in this category.'});
    // }
    return c.json({ success: true, message: 'Series updated successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'Series not found.' });
};
