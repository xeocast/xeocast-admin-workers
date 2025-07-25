import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi'; // Added for z.infer
import {
  YouTubePlaylistSchema,
  ListYouTubePlaylistsQuerySchema,
  ListYouTubePlaylistsResponseSchema,
  YouTubePlaylistSortBySchema,
} from '../../schemas/youtube-playlist.schemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/common.schemas';

// Helper to map DB row to YouTubePlaylistSchema compatible object
const mapDbRowToYouTubePlaylist = (dbRow: any): z.infer<typeof YouTubePlaylistSchema> => { // Ensure this maps all fields for YouTubePlaylistSchema
  return YouTubePlaylistSchema.parse({
    id: dbRow.id,
    youtubePlatformId: dbRow.youtube_platform_id,
    title: dbRow.title,
    description: dbRow.description,
    channelId: dbRow.channel_id,
    seriesId: dbRow.series_id,
    // thumbnail_url was removed from schema
    createdAt: typeof dbRow.created_at === 'number' ? new Date(dbRow.created_at * 1000).toISOString() : dbRow.created_at,
    updatedAt: typeof dbRow.updated_at === 'number' ? new Date(dbRow.updated_at * 1000).toISOString() : dbRow.updated_at,
  });
};

export const listYouTubePlaylistsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListYouTubePlaylistsQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid query parameters.'}), 400);
  }

  const { page, limit, title, seriesId, channelId, sortBy, sortOrder } = queryParseResult.data;
  const offset = (page - 1) * limit;

  try {
    const selectFields = 'id, youtube_platform_id, title, description, channel_id, series_id, created_at, updated_at';
    let query = `SELECT ${selectFields} FROM youtube_playlists`;
    let countQueryStr = 'SELECT COUNT(*) as total FROM youtube_playlists';
    
    const conditions: string[] = [];
    const bindings: (string | number)[] = [];
    let paramIndex = 1;

    if (title) {
      conditions.push(`LOWER(title) LIKE LOWER(?${paramIndex++})`);
      bindings.push(`%${title}%`);
    }
    if (seriesId !== undefined) {
      conditions.push(`series_id = ?${paramIndex++}`);
      bindings.push(seriesId);
    }
    if (channelId !== undefined) {
      conditions.push(`channel_id = ?${paramIndex++}`);
      bindings.push(channelId);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQueryStr += whereClause;
    }

    // Whitelist of sortable columns
    const validSortColumns: Record<z.infer<typeof YouTubePlaylistSortBySchema>, string> = {
      id: 'id',
      title: 'title',
      seriesId: 'series_id',
      channelId: 'channel_id',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };

    const orderByColumn = validSortColumns[sortBy] || 'title';
    const orderByDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const orderByString = `ORDER BY ${orderByColumn} ${orderByDirection}`;

    query += ` ${orderByString} LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`;

    const playlistsStmt = c.env.DB.prepare(query).bind(...bindings, limit, offset);
    const countStmt = c.env.DB.prepare(countQueryStr).bind(...bindings);

    const [playlistsDbResult, countResult] = await Promise.all([
      playlistsStmt.all(),
      countStmt.first<{ total: number }>()
    ]);

    if (!playlistsDbResult || !playlistsDbResult.results || countResult === null) {
        return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to fetch playlists or count: Invalid database response.' }), 500);
    }

    const playlists = playlistsDbResult.results.map(mapDbRowToYouTubePlaylist);
    
    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return c.json(ListYouTubePlaylistsResponseSchema.parse({ playlists, pagination }), 200);

  } catch (error: any) {
    console.error('Error listing YouTube playlists:', error);
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to list YouTube playlists due to a server error.' }), 500);
  }
};
