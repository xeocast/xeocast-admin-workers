import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi';
import {
  YouTubePlaylistSchema,
  GetYouTubePlaylistResponseSchema,
  YouTubePlaylistNotFoundErrorSchema
} from '../../schemas/youtubePlaylistSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

// Re-using a similar mapper, can be centralized if used in more places
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

export const getYouTubePlaylistByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format in path.' }), 400);
  }
  const id = parseInt(paramsValidation.data.id, 10);

  try {
    const stmt = c.env.DB.prepare(
      'SELECT id, youtube_platform_id, title, description, channel_id, series_id, created_at, updated_at FROM youtube_playlists WHERE id = ?1'
    ).bind(id);
    
    const dbPlaylist = await stmt.first();

    if (!dbPlaylist) {
      return c.json(YouTubePlaylistNotFoundErrorSchema.parse({ success: false, message: 'YouTube playlist not found.' }), 404);
    }

    const playlist = mapDbRowToYouTubePlaylist(dbPlaylist);
    return c.json(GetYouTubePlaylistResponseSchema.parse({ success: true, playlist: playlist }), 200);

  } catch (error: any) {
    console.error(`Error getting YouTube playlist by ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to get YouTube playlist due to a server error.' }), 500);
  }
};
