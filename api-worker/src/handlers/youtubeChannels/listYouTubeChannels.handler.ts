import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi'; // Added zod import
import {
  YouTubeChannelSchema,
  ListYouTubeChannelsQuerySchema,
  ListYouTubeChannelsResponseSchema,
  YouTubeChannelSortBySchema,
  SortOrderSchema
} from '../../schemas/youtubeChannelSchemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

// Helper to map DB row to YouTubeChannelSchema compatible object
const mapDbRowToYouTubeChannel = (row: any): z.infer<typeof YouTubeChannelSchema> => {
  return YouTubeChannelSchema.parse({
    id: row.id,
    show_id: row.show_id,
    youtube_platform_id: row.youtube_platform_id,
    youtube_platform_category_id: row.youtube_platform_category_id,
    title: row.title,
    description: row.description,
    video_description_template: row.video_description_template,
    first_comment_template: row.first_comment_template,
    language_code: row.language_code,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
};

export const listYouTubeChannelsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParams = c.req.query();
  const validationResult = ListYouTubeChannelsQuerySchema.safeParse(queryParams);

  if (!validationResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        
        message: 'Invalid query parameters.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { page, limit, show_id, title, language_code, sortBy, sortOrder } = validationResult.data;
  const offset = (page - 1) * limit;

  try {
    const baseQuery = 'FROM youtube_channels';
    const whereClauses: string[] = [];
    const bindings: (string | number)[] = [];
    let paramIndex = 1;

    if (show_id !== undefined) {
      whereClauses.push(`show_id = ?${paramIndex++}`);
      bindings.push(show_id);
    }
    if (title) {
      whereClauses.push(`LOWER(title) LIKE LOWER(?${paramIndex++})`);
      bindings.push(`%${title}%`);
    }
    if (language_code) {
      whereClauses.push(`language_code = ?${paramIndex++}`);
      bindings.push(language_code);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Whitelist of sortable columns
    const validSortColumns: Record<z.infer<typeof YouTubeChannelSortBySchema>, string> = {
      id: 'id',
      title: 'title',
      show_id: 'show_id',
      language_code: 'language_code',
      created_at: 'created_at',
      updated_at: 'updated_at'
    };

    const orderByColumn = validSortColumns[sortBy] || 'title';
    const orderByDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderByString = `ORDER BY ${orderByColumn} ${orderByDirection}`;

    const channelsSelectFields = 'id, show_id, youtube_platform_id, youtube_platform_category_id, title, description, video_description_template, first_comment_template, language_code, created_at, updated_at';

    const channelsQueryString = `SELECT ${channelsSelectFields} ${baseQuery} ${whereString} ${orderByString} LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`;
    const countQueryString = `SELECT COUNT(*) as total ${baseQuery} ${whereString}`;

    const channelsStmt = c.env.DB.prepare(channelsQueryString).bind(...bindings, limit, offset);
    const countStmt = c.env.DB.prepare(countQueryString).bind(...bindings);

    const [{ results: channelResults }, countResult] = await Promise.all([
      channelsStmt.all(),
      countStmt.first<{ total: number }>(),
    ]);

    if (!channelResults || countResult === null) {
      console.error('Failed to fetch YouTube channels or count, D1 results:', channelResults, countResult);
      return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to retrieve YouTube channels from the database.' }), 500);
    }

    const channels = channelResults ? channelResults.map(mapDbRowToYouTubeChannel) : [];
    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return c.json(ListYouTubeChannelsResponseSchema.parse({ channels, pagination }), 200);

  } catch (error: any) {
    console.error('Error listing YouTube channels:', error);
    // Check if it's a Zod parsing error during mapping
    if (error instanceof z.ZodError) {
        console.error('Zod validation error during mapping list results:', error.flatten());
        return c.json(GeneralServerErrorSchema.parse({ message: 'Error processing channel data.'}), 500);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to list YouTube channels.' }), 500);
  }
};
