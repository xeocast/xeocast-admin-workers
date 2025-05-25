import { Context } from 'hono';
import { z } from 'zod';
import type { CloudflareEnv } from '../../env';
import {
  PodcastSchema,
  PodcastStatusSchema,
  PodcastPublicationTypeSchema, // Use for 'evergreen'/'news' type filtering
  ListPodcastsResponseSchema
} from '../../schemas/podcastSchemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

// This schema should align with the one in `src/routes/podcasts.ts`
const ListPodcastsQueryInternalSchema = z.object({
  page: z.string().optional().default('1').transform(val => parseInt(val, 10)).refine(val => val > 0, { message: 'Page must be positive' }),
  limit: z.string().optional().default('10').transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100, { message: 'Limit must be between 1 and 100' }),
  status: PodcastStatusSchema.optional(),
  category_id: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || val > 0, { message: 'Category ID must be positive' }),
  series_id: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || val > 0, { message: 'Series ID must be positive' }),
  title: z.string().optional(), // Added for title filtering
  type: PodcastPublicationTypeSchema.optional() // Use for 'evergreen'/'news' type filtering
});

export const listPodcastsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListPodcastsQueryInternalSchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid query parameters.', errors: queryParseResult.error.flatten().fieldErrors }), 400);
  }

  const { page, limit, status, category_id, series_id, title, type } = queryParseResult.data;
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let bindings: (string | number)[] = [];
  let paramIndex = 1;

  if (status) {
    whereClauses.push(`status = ?${paramIndex++}`);
    bindings.push(status);
  }
  if (category_id) {
    whereClauses.push(`category_id = ?${paramIndex++}`);
    bindings.push(category_id);
  }
  if (series_id) {
    whereClauses.push(`series_id = ?${paramIndex++}`);
    bindings.push(series_id);
  }
  if (title) {
    whereClauses.push(`title LIKE ?${paramIndex++}`);
    bindings.push(`%${title}%`);
  }
  if (type) {
    whereClauses.push(`type = ?${paramIndex++}`);
    bindings.push(type);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  try {
    const podcastsQuery = c.env.DB.prepare(
      `SELECT * FROM podcasts ${whereString} ORDER BY created_at DESC LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`
    ).bind(...bindings, limit, offset);
    
    const countQuery = c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM podcasts ${whereString}`
    ).bind(...bindings);

    const [podcastsResult, countResult] = await Promise.all([
      podcastsQuery.all<any>(), // D1 returns any[], needs parsing with PodcastSchema
      countQuery.first<{ total: number }>()
    ]);

    if (!podcastsResult.results || countResult === null) {
        console.error('Failed to fetch podcasts or count, D1 results:', podcastsResult, countResult);
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to retrieve podcasts from the database.'}), 500);
    }

    // Validate each podcast against the Zod schema
    const validatedPodcasts = z.array(PodcastSchema).safeParse(podcastsResult.results);
    if (!validatedPodcasts.success) {
        console.error('Podcast data validation error after fetching from DB:', validatedPodcasts.error.flatten());
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error validating podcast data from database.'}), 500);
    }

    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return c.json(ListPodcastsResponseSchema.parse({
      success: true,
      podcasts: validatedPodcasts.data,
      pagination: pagination,
    }), 200);

  } catch (error) {
    console.error('Error listing podcasts:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to list podcasts due to a server error.' }), 500);
  }
};
