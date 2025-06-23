import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from 'zod';
import {
  SeriesSummarySchema,
  ListSeriesQuerySchema, // Import new query schema
  ListSeriesResponseSchema,
  SeriesSortBySchema, // Added for sorting
} from '../../schemas/series.schemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/common.schemas';

interface SeriesSummaryFromDB {
  id: number;
  title: string;
  slug: string;
  show_id: number;
  // created_at and updated_at are not in SeriesSummarySchema, so not strictly needed here
  // but if they were, they'd be: created_at: string; updated_at: string;
}

export const listSeriesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListSeriesQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
      message: 'Invalid query parameters.', 
      errors: queryParseResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { page, limit, title, show_id, sortBy, sortOrder } = queryParseResult.data;
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let bindings: (string | number)[] = [];
  let paramIndex = 1;

  if (show_id !== undefined) {
    whereClauses.push(`show_id = ?${paramIndex++}`);
    bindings.push(show_id);
  }
  if (title) {
    whereClauses.push(`LOWER(title) LIKE LOWER(?${paramIndex++})`);
    bindings.push(`%${title}%`);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Whitelist of sortable columns and their actual DB names
  const validSortColumns: Record<z.infer<typeof SeriesSortBySchema>, string> = {
    id: 'id',
    title: 'title',
    show_id: 'show_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
  };

  const orderByColumn = validSortColumns[sortBy] || 'title'; // Default to 'title'
  const orderByDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Default to ASC

  const orderByString = `ORDER BY ${orderByColumn} ${orderByDirection}`;

  try {
    const seriesQueryStmt = c.env.DB.prepare(
      `SELECT id, title, slug, show_id FROM series ${whereString} ${orderByString} LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`
    ).bind(...bindings, limit, offset);

    const countQueryStmt = c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM series ${whereString}`
    ).bind(...bindings);

    const [seriesDbResult, countResult] = await Promise.all([
      seriesQueryStmt.all<SeriesSummaryFromDB>(),
      countQueryStmt.first<{ total: number }>()
    ]);

    if (!seriesDbResult.results || countResult === null) {
      console.error('Failed to fetch series or count, D1 results:', seriesDbResult, countResult);
      return c.json(GeneralServerErrorSchema.parse({ 
        message: 'Failed to retrieve series from the database.'
      }), 500);
    }

    // Validate each summary - SeriesSummarySchema does not include created_at/updated_at, so direct mapping is fine.
    const validatedSeriesSummaries = z.array(SeriesSummarySchema).safeParse(seriesDbResult.results);

    if (!validatedSeriesSummaries.success) {
      console.error('Final series list validation error:', validatedSeriesSummaries.error.flatten());
      return c.json(GeneralServerErrorSchema.parse({ 
        message: 'Error validating final series list structure.'
      }), 500);
    }

    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return c.json(ListSeriesResponseSchema.parse({
      series: validatedSeriesSummaries.data,
      pagination: pagination,
    }), 200);

  } catch (error) {
    console.error('Error listing series:', error);
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to list series due to a server error.' }), 500);
  }
};
