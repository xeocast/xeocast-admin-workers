// src/routes/youtubePlaylists.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env';
import {
  YouTubePlaylistCreateRequestSchema,
  YouTubePlaylistCreateResponseSchema,
  ListYouTubePlaylistsQuerySchema,
  ListYouTubePlaylistsResponseSchema,
  GetYouTubePlaylistResponseSchema,
  YouTubePlaylistUpdateRequestSchema,
  YouTubePlaylistUpdateResponseSchema,
  YouTubePlaylistDeleteResponseSchema,
  YouTubePlaylistPlatformIdExistsErrorSchema,
  YouTubePlaylistCreateFailedErrorSchema,
  YouTubePlaylistNotFoundErrorSchema,
  YouTubePlaylistUpdateFailedErrorSchema,
  YouTubePlaylistDeleteFailedErrorSchema
} from '../schemas/youtube-playlist.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../schemas/common.schemas';
import { createYouTubePlaylistHandler } from '../handlers/youtube-playlists/create-youtube-playlist.handler';
import { listYouTubePlaylistsHandler } from '../handlers/youtube-playlists/list-youtube-playlists.handler';
import { getYouTubePlaylistByIdHandler } from '../handlers/youtube-playlists/get-youtube-playlist-by-id.handler';
import { updateYouTubePlaylistHandler } from '../handlers/youtube-playlists/update-youtube-playlist.handler';
import { deleteYouTubePlaylistHandler } from '../handlers/youtube-playlists/delete-youtube-playlist.handler';

const youtubePlaylistRoutes = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

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
    query: ListYouTubePlaylistsQuerySchema, // This now includes page, limit, title, series_id, channel_id
  },
  responses: {
    200: { content: { 'application/json': { schema: ListYouTubePlaylistsResponseSchema } }, description: 'List of YouTube playlists' },
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Bad request (e.g., invalid query parameters)' },
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
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Bad request (e.g., invalid ID format)' },
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
