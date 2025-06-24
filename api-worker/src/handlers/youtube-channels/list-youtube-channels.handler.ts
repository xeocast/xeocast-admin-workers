import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi'; // Added zod import
import {
  YouTubeChannelSchema,
  ListYouTubeChannelsQuerySchema,
  ListYouTubeChannelsResponseSchema,
  YouTubeChannelSortBySchema,
} from '../../schemas/youtube-channel.schemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/common.schemas';



export const listYouTubeChannelsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParams = c.req.query();
  const validationResult = ListYouTubeChannelsQuerySchema.safeParse(queryParams);

  if (!validationResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({
      message: 'Invalid query parameters.',
      errors: validationResult.error.flatten().fieldErrors,
    }), 400);
  }

  const { page, limit, showId, title, languageCode, sortBy, sortOrder } = validationResult.data;
  const offset = (page - 1) * limit;

  try {
    const baseQuery = 'FROM youtube_channels';
    const whereClauses: string[] = [];
    const bindings: (string | number)[] = [];
    let paramIndex = 1;

    if (showId !== undefined) {
      whereClauses.push(`show_id = ?${paramIndex++}`);
      bindings.push(showId);
    }
    if (title) {
      whereClauses.push(`LOWER(title) LIKE LOWER(?${paramIndex++})`);
      bindings.push(`%${title}%`);
    }
    if (languageCode) {
      whereClauses.push(`language_code = ?${paramIndex++}`);
      bindings.push(languageCode);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Whitelist of sortable columns
    const validSortColumns: Record<z.infer<typeof YouTubeChannelSortBySchema>, string> = {
      id: 'id',
      title: 'title',
      showId: 'show_id',
      languageCode: 'language_code',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
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

    const channels = z.array(YouTubeChannelSchema).parse(channelResults);
    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    return c.json(ListYouTubeChannelsResponseSchema.parse({
      channels: channels,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    }));

  } catch (error: any) {
    console.error('Error listing YouTube channels:', error);
    if (error instanceof z.ZodError) {
      return c.json(GeneralServerErrorSchema.parse({
        message: 'Data validation error after fetching from database.',
        errors: error.flatten()
      }), 500);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'An unexpected error occurred.' }), 500);
  }
};
