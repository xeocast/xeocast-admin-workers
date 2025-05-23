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
import { createYouTubePlaylistHandler } from '../handlers/youtubePlaylists/createYouTubePlaylist.handler';
import { listYouTubePlaylistsHandler } from '../handlers/youtubePlaylists/listYouTubePlaylists.handler';
import { getYouTubePlaylistByIdHandler } from '../handlers/youtubePlaylists/getYouTubePlaylistById.handler';
import { updateYouTubePlaylistHandler } from '../handlers/youtubePlaylists/updateYouTubePlaylist.handler';
import { updateYouTubePlaylistPlatformIdHandler } from '../handlers/youtubePlaylists/updateYouTubePlaylistPlatformId.handler';
import { deleteYouTubePlaylistHandler } from '../handlers/youtubePlaylists/deleteYouTubePlaylist.handler';

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
youtubePlaylistRoutes.openapi(createPlaylistRouteDef, createYouTubePlaylistHandler);

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
youtubePlaylistRoutes.openapi(listPlaylistsRouteDef, listYouTubePlaylistsHandler);

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
youtubePlaylistRoutes.openapi(getPlaylistByIdRouteDef, getYouTubePlaylistByIdHandler);

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
youtubePlaylistRoutes.openapi(updatePlaylistRouteDef, updateYouTubePlaylistHandler);

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
youtubePlaylistRoutes.openapi(updatePlatformIdRouteDef, updateYouTubePlaylistPlatformIdHandler);


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
youtubePlaylistRoutes.openapi(deletePlaylistRouteDef, deleteYouTubePlaylistHandler);

export default youtubePlaylistRoutes;
