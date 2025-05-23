import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SeriesCreateRequestSchema } from '../../schemas/seriesSchemas';

export const createSeriesHandler = async (c: Context) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = SeriesCreateRequestSchema.safeParse(body);

  if (!validationResult.success) {
    console.error('Create series validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for creating series.', cause: validationResult.error });
  }

  const seriesData = validationResult.data;
  console.log('Attempting to create series with data:', seriesData);

  // Placeholder for actual series creation logic
  // 1. Validate category_id
  // 2. Check if series title already exists within the same category_id
  // 3. Store series in the database

  // Simulate success for now
  const mockSeriesId = Math.floor(Math.random() * 1000) + 1;
  // Simulate title exists error
  // if (seriesData.title === 'existing_series_title' && seriesData.category_id === 1) {
  //   throw new HTTPException(400, { message: 'Series title already exists in this category.'});
  // }
  return c.json({ success: true, message: 'Series created successfully.' as const, seriesId: mockSeriesId }, 201);
};
