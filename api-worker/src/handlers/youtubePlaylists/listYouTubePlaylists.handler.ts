import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { YouTubePlaylistSchema, ListYouTubePlaylistsQuerySchema, ListYouTubePlaylistsResponseSchema } from '../../schemas/youtubePlaylistSchemas';
import { z } from 'zod';

export const listYouTubePlaylistsHandler = async (c: Context) => {
  const queryParseResult = ListYouTubePlaylistsQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    throw new HTTPException(400, { message: 'Invalid query parameters.', cause: queryParseResult.error });
  }

  const { series_id, youtube_channel_id } = queryParseResult.data;
  console.log('Listing YouTube playlists with query:', { series_id, youtube_channel_id });

  // Placeholder for actual playlist listing logic
  // 1. Fetch playlists from database, applying filters (e.g., by series_id, youtube_channel_id)

  // Simulate success with mock data
  const placeholderPlaylist = YouTubePlaylistSchema.parse({
    id: 1,
    series_id: series_id || 1,
    youtube_channel_id: youtube_channel_id || 1,
    youtube_platform_id: 'PLsampleplaylist123',
    title: 'Sample Playlist',
    description: 'This is a sample YouTube playlist.',
    thumbnail_url: 'https://i.ytimg.com/vi/sample/hqdefault.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const responsePayload: z.infer<typeof ListYouTubePlaylistsResponseSchema> = { success: true, playlists: [placeholderPlaylist] };
  return c.json(responsePayload, 200);
};
