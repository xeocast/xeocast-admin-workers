import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi'; // Added for z.infer
import {
  YouTubePlaylistSchema,
  ListYouTubePlaylistsQuerySchema,
  ListYouTubePlaylistsResponseSchema
} from '../../schemas/youtubePlaylistSchemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

// Helper to map DB row to YouTubePlaylistSchema compatible object
const mapDbRowToYouTubePlaylist = (dbRow: any): z.infer<typeof YouTubePlaylistSchema> => {
  return YouTubePlaylistSchema.parse({
    id: dbRow.id,
    youtube_platform_id: dbRow.youtube_platform_id,
    title: dbRow.title,
    description: dbRow.description,
    channel_id: dbRow.channel_id, // DB stores as channel_id, schema now expects channel_id
    series_id: dbRow.series_id,
    // thumbnail_url was removed from schema
    created_at: typeof dbRow.created_at === 'number' ? new Date(dbRow.created_at * 1000).toISOString() : dbRow.created_at,
    updated_at: typeof dbRow.updated_at === 'number' ? new Date(dbRow.updated_at * 1000).toISOString() : dbRow.updated_at,
  });
};

export const listYouTubePlaylistsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListYouTubePlaylistsQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid query parameters.'}), 400);
  }

  const { series_id, channel_id } = queryParseResult.data; // Renamed from youtube_channel_id

  try {
    let query = 'SELECT id, youtube_platform_id, title, description, channel_id, series_id, created_at, updated_at FROM youtube_playlists';
    const conditions: string[] = [];
    const bindings: any[] = [];
    let bindingIdx = 1;

    if (series_id !== undefined) {
      conditions.push(`series_id = ?${bindingIdx}`);
      bindings.push(series_id);
      bindingIdx++;
    }

    if (channel_id !== undefined) {
      conditions.push(`channel_id = ?${bindingIdx}`); // DB uses channel_id
      bindings.push(channel_id);
      bindingIdx++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const dbResult = await stmt.all();

    if (!dbResult || !dbResult.results) {
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to fetch playlists: Invalid database response.' }), 500);
    }

    const playlists = dbResult.results.map(mapDbRowToYouTubePlaylist);
    
    return c.json(ListYouTubePlaylistsResponseSchema.parse({ success: true, playlists: playlists }), 200);

  } catch (error: any) {
    console.error('Error listing YouTube playlists:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to list YouTube playlists due to a server error.' }), 500);
  }
};
