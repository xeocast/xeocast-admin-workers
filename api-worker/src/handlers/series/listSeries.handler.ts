import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SeriesSummarySchema } from '../../schemas/seriesSchemas'; // For mock data
import { z } from 'zod';

// Define a schema for query parameters if needed, e.g., for filtering by category_id
const ListSeriesQuerySchema = z.object({
  category_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});

export const listSeriesHandler = async (c: Context) => {
  const queryParseResult = ListSeriesQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    throw new HTTPException(400, { message: 'Invalid query parameters.', cause: queryParseResult.error });
  }

  const { category_id } = queryParseResult.data;
  console.log('Listing series with query:', { category_id });

  // Placeholder for actual series listing logic
  // 1. Fetch series from database, applying filters (e.g., by category_id)

  // Simulate success with mock data
  const placeholderSeries = SeriesSummarySchema.parse({
    id: 1,
    title: 'My Awesome Podcast Series',
    category_id: category_id || 1,
    youtube_playlist_id: 'PLxxxxxxxxxxxxxxxxx',
  });
  const responsePayload = { success: true, series: [placeholderSeries] };
  return c.json(responsePayload, 200);
};
