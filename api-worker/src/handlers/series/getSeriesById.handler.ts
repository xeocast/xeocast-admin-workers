import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SeriesSchema } from '../../schemas/seriesSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const getSeriesByIdHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to get series by ID:', id);

  // Placeholder for actual logic to fetch series by ID
  // 1. Fetch series from database

  // Simulate success / not found
  if (id === 1) { // Assuming series with ID 1 exists for mock
    const placeholderSeries = SeriesSchema.parse({
      id: id,
      title: 'Specific Series Title',
      description: 'Detailed description of this specific series.',
      category_id: 1,
      youtube_playlist_id: 'PLyyyyyyyyyyyyyyy',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return c.json({ success: true, series: placeholderSeries }, 200);
  }
  throw new HTTPException(404, { message: 'Series not found.' });
};
