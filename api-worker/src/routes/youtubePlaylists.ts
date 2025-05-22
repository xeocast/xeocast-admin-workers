// src/routes/youtubePlaylists.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  YouTubePlaylistCreateRequestSchema,
  YouTubePlaylistCreateResponseSchema,
  ListYouTubePlaylistsQuerySchema,
  ListYouTubePlaylistsResponseSchema,
  GetYouTubePlaylistResponseSchema,
  YouTubePlaylistUpdateRequestSchema,
  YouTubePlaylistUpdateResponseSchema,
  YouTubePlaylistUpdatePlatformIdRequestSchema, // For specific platform ID update
  YouTubePlaylistDeleteResponseSchema,
  YouTubePlaylistSchema,
  YouTubePlaylistPlatformIdExistsErrorSchema,
  YouTubePlaylistCreateFailedErrorSchema,
  YouTubePlaylistNotFoundErrorSchema,
  YouTubePlaylistUpdateFailedErrorSchema,
  YouTubePlaylistDeleteFailedErrorSchema
} from '../schemas/youtubePlaylistSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, MessageResponseSchema } from '../schemas/commonSchemas';

const youtubePlaylistRoutes = new OpenAPIHono();

// POST /youtube-playlists - Create YouTube Playlist
const createPlaylistRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: YouTubePlaylistCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: YouTubePlaylistCreateResponseSchema } }, description: 'YouTube playlist created' },
    400: { content: { 'application/json': { schema: z.union([YouTubePlaylistPlatformIdExistsErrorSchema, YouTubePlaylistCreateFailedErrorSchema]) } }, description: 'Invalid input or platform ID exists' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Creates a new YouTube playlist link.',
  tags: ['YouTubePlaylists'],
});
youtubePlaylistRoutes.openapi(createPlaylistRouteDef, (c) => {
  const newPlaylistData = c.req.valid('json');
  console.log('Create YouTube playlist:', newPlaylistData);
  // Placeholder: Check for existing youtube_platform_id for the channel
  const createdPlaylistId = Math.floor(Math.random() * 1000) + 1;
  return c.json({ success: true, message: 'YouTube playlist created successfully.' as const, playlistId: createdPlaylistId }, 201);
});

// GET /youtube-playlists - List YouTube Playlists
const listPlaylistsRouteDef = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: ListYouTubePlaylistsQuerySchema,
  },
  responses: {
    200: { content: { 'application/json': { schema: ListYouTubePlaylistsResponseSchema } }, description: 'List of YouTube playlists' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all YouTube playlists, optionally filtered.',
  tags: ['YouTubePlaylists'],
});
youtubePlaylistRoutes.openapi(listPlaylistsRouteDef, (c) => {
  const { series_id, youtube_channel_id } = c.req.valid('query');
  console.log('List YouTube playlists - Query Params:', { series_id, youtube_channel_id });

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
  const responsePayload = { success: true, playlists: [placeholderPlaylist] };
  return c.json(ListYouTubePlaylistsResponseSchema.parse(responsePayload), 200);
});

// GET /youtube-playlists/{id} - Get YouTube Playlist by ID
const getPlaylistByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetYouTubePlaylistResponseSchema } }, description: 'YouTube playlist details' },
    404: { content: { 'application/json': { schema: YouTubePlaylistNotFoundErrorSchema } }, description: 'YouTube playlist not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets a YouTube playlist by its internal ID.',
  tags: ['YouTubePlaylists'],
});
youtubePlaylistRoutes.openapi(getPlaylistByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Get YouTube playlist by ID:', id);
  if (id === '999') { // Simulate not found
    return c.json(YouTubePlaylistNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'YouTube playlist not found.' }), 404);
  }
  const placeholderPlaylist = YouTubePlaylistSchema.parse({
    id: parseInt(id),
    series_id: 2,
    youtube_channel_id: 1,
    youtube_platform_id: 'PLanotherplaylist789',
    title: 'Another Sample Playlist',
    description: 'Details about this other playlist.',
    thumbnail_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return c.json({ success: true, playlist: placeholderPlaylist }, 200);
});

// PUT /youtube-playlists/{id} - Update YouTube Playlist (General)
const updatePlaylistRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: YouTubePlaylistUpdateRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: YouTubePlaylistUpdateResponseSchema } }, description: 'YouTube playlist updated' },
    400: { content: { 'application/json': { schema: z.union([YouTubePlaylistPlatformIdExistsErrorSchema, YouTubePlaylistUpdateFailedErrorSchema]) } }, description: 'Invalid input or platform ID conflict' },
    404: { content: { 'application/json': { schema: YouTubePlaylistNotFoundErrorSchema } }, description: 'YouTube playlist not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates an existing YouTube playlist link.',
  tags: ['YouTubePlaylists'],
});
youtubePlaylistRoutes.openapi(updatePlaylistRouteDef, (c) => {
  const { id } = c.req.valid('param');
  const updatedPlaylistData = c.req.valid('json');
  console.log('Update YouTube playlist:', id, updatedPlaylistData);
  if (id === '999') { // Simulate not found
    return c.json(YouTubePlaylistNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'YouTube playlist not found.' }), 404);
  }
  return c.json({ success: true, message: 'YouTube playlist updated successfully.' as const }, 200);
});

// PUT /youtube-playlists/{id}/platform-id - Update YouTube Playlist Platform ID (Specific)
const updatePlatformIdRouteDef = createRoute({
  method: 'put',
  path: '/{id}/platform-id', // As per old spec, but consider if general PUT is enough
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: YouTubePlaylistUpdatePlatformIdRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: MessageResponseSchema } }, description: 'YouTube playlist platform ID updated' }, // Generic success
    400: { content: { 'application/json': { schema: z.union([YouTubePlaylistPlatformIdExistsErrorSchema, YouTubePlaylistUpdateFailedErrorSchema]) } }, description: 'Invalid input or platform ID conflict' },
    404: { content: { 'application/json': { schema: YouTubePlaylistNotFoundErrorSchema } }, description: 'YouTube playlist not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates the YouTube Platform ID of an existing YouTube playlist.',
  tags: ['YouTubePlaylists'],
});
youtubePlaylistRoutes.openapi(updatePlatformIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  const { youtube_platform_id } = c.req.valid('json');
  console.log('Update YouTube playlist platform ID:', id, youtube_platform_id);
  if (id === '999') { // Simulate not found
    return c.json(YouTubePlaylistNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'YouTube playlist not found.' }), 404);
  }
  return c.json({ success: true, message: 'YouTube playlist platform ID updated successfully.' as const }, 200);
});


// DELETE /youtube-playlists/{id} - Delete YouTube Playlist
const deletePlaylistRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: YouTubePlaylistDeleteResponseSchema } }, description: 'YouTube playlist deleted' },
    400: { content: { 'application/json': { schema: YouTubePlaylistDeleteFailedErrorSchema } }, description: 'Deletion failed' },
    404: { content: { 'application/json': { schema: YouTubePlaylistNotFoundErrorSchema } }, description: 'YouTube playlist not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes a YouTube playlist link.',
  tags: ['YouTubePlaylists'],
});
youtubePlaylistRoutes.openapi(deletePlaylistRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Delete YouTube playlist:', id);
  if (id === '999') { // Simulate not found
    return c.json(YouTubePlaylistNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'YouTube playlist not found.' }), 404);
  }
  return c.json({ success: true, message: 'YouTube playlist deleted successfully.' as const }, 200);
});

export default youtubePlaylistRoutes;
