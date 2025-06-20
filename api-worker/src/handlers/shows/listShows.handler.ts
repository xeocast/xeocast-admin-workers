import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from 'zod';
import {
  ListShowsQuerySchema, // Added
  ListShowsResponseSchema,
  ShowSummarySchema,
  ShowSortBySchema, // Added for sorting
  SortOrderSchema // Added for sorting
} from '../../schemas/showSchemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas'; // Added GeneralBadRequestErrorSchema

export const listShowsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListShowsQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
      message: 'Invalid query parameters.', 
      errors: queryParseResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { page, limit, name, language_code, sortBy, sortOrder } = queryParseResult.data;
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let bindings: (string | number)[] = [];
  let paramIndex = 1;

  if (name) {
    whereClauses.push(`LOWER(name) LIKE LOWER(?${paramIndex++})`);
    bindings.push(`%${name}%`);
  }
  if (language_code) {
    whereClauses.push(`language_code = ?${paramIndex++}`);
    bindings.push(language_code);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Whitelist of sortable columns and their actual DB names
  const validSortColumns: Record<z.infer<typeof ShowSortBySchema>, string> = {
    id: 'id',
    name: 'name',
    language_code: 'language_code',
    created_at: 'created_at',
    updated_at: 'updated_at',
  };

  const orderByColumn = validSortColumns[sortBy] || 'name'; // Default to 'name'
  const orderByDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Default to ASC

  const orderByString = `ORDER BY ${orderByColumn} ${orderByDirection}`;

  try {
    const showsQuery = c.env.DB.prepare(
      `SELECT id, name, language_code, slug FROM shows ${whereString} ${orderByString} LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`
    ).bind(...bindings, limit, offset);
    
    const countQuery = c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM shows ${whereString}`
    ).bind(...bindings);

    const [showsDbResult, countResult] = await Promise.all([
      showsQuery.all<z.infer<typeof ShowSummarySchema>>(), 
      countQuery.first<{ total: number }>()
    ]);

    if (!showsDbResult.results || countResult === null) {
        console.error('Failed to fetch shows or count, D1 results:', showsDbResult, countResult);
        return c.json(GeneralServerErrorSchema.parse({ 
          message: 'Failed to retrieve shows from the database.'
        }), 500);
    }

    const shows = showsDbResult.results ? showsDbResult.results.map((row: z.infer<typeof ShowSummarySchema>) => ShowSummarySchema.parse(row)) : [];
    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return c.json(ListShowsResponseSchema.parse({
      shows: shows,
      pagination: pagination,
    }), 200);

  } catch (error) {
    console.error('Error listing shows:', error);
    // Check if it's a ZodError for parsing individual show rows, though less likely here with ShowSummarySchema
    if (error instanceof z.ZodError) {
      console.error('Zod validation error during show processing:', error.flatten());
      return c.json(GeneralServerErrorSchema.parse({
        message: 'Error processing show data.'
      }), 500);
    }
    return c.json(GeneralServerErrorSchema.parse({
      message: 'Failed to retrieve shows.'
    }), 500);
  }
};
