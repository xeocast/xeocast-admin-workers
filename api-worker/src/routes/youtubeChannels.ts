// src/routes/youtubeChannels.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  YouTubeChannelCreateRequestSchema,
  YouTubeChannelCreateResponseSchema,
  ListYouTubeChannelsQuerySchema,
  ListYouTubeChannelsResponseSchema,
  GetYouTubeChannelResponseSchema,
  YouTubeChannelUpdateRequestSchema,
  YouTubeChannelUpdateResponseSchema,
  YouTubeChannelDeleteResponseSchema,
  YouTubeChannelSchema,
  YouTubeChannelPlatformIdExistsErrorSchema,
  YouTubeChannelCreateFailedErrorSchema,
  YouTubeChannelNotFoundErrorSchema,
  YouTubeChannelUpdateFailedErrorSchema,
  YouTubeChannelDeleteFailedErrorSchema
} from '../schemas/youtubeChannelSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../schemas/commonSchemas';
import { createYouTubeChannelHandler } from '../handlers/youtubeChannels/createYouTubeChannel.handler';
import { listYouTubeChannelsHandler } from '../handlers/youtubeChannels/listYouTubeChannels.handler';
import { getYouTubeChannelByIdHandler } from '../handlers/youtubeChannels/getYouTubeChannelById.handler';
import { updateYouTubeChannelHandler } from '../handlers/youtubeChannels/updateYouTubeChannel.handler';
import { deleteYouTubeChannelHandler } from '../handlers/youtubeChannels/deleteYouTubeChannel.handler';

const youtubeChannelRoutes = new OpenAPIHono();

// POST /youtube-channels - Create YouTube Channel
const createChannelRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: YouTubeChannelCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: YouTubeChannelCreateResponseSchema } }, description: 'YouTube channel created' },
    400: { content: { 'application/json': { schema: z.union([YouTubeChannelPlatformIdExistsErrorSchema, YouTubeChannelCreateFailedErrorSchema]) } }, description: 'Invalid input or platform ID exists' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Creates a new YouTube channel link.',
  tags: ['YouTubeChannels'],
});
youtubeChannelRoutes.openapi(createChannelRouteDef, createYouTubeChannelHandler);

// GET /youtube-channels - List YouTube Channels
const listChannelsRouteDef = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: ListYouTubeChannelsQuerySchema,
  },
  responses: {
    200: { content: { 'application/json': { schema: ListYouTubeChannelsResponseSchema } }, description: 'List of YouTube channels' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all YouTube channels, optionally filtered by category ID.',
  tags: ['YouTubeChannels'],
});
youtubeChannelRoutes.openapi(listChannelsRouteDef, listYouTubeChannelsHandler);

// GET /youtube-channels/{id} - Get YouTube Channel by ID
const getChannelByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetYouTubeChannelResponseSchema } }, description: 'YouTube channel details' },
    404: { content: { 'application/json': { schema: YouTubeChannelNotFoundErrorSchema } }, description: 'YouTube channel not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets a YouTube channel by its internal ID.',
  tags: ['YouTubeChannels'],
});
youtubeChannelRoutes.openapi(getChannelByIdRouteDef, getYouTubeChannelByIdHandler);

// PUT /youtube-channels/{id} - Update YouTube Channel
const updateChannelRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: YouTubeChannelUpdateRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: YouTubeChannelUpdateResponseSchema } }, description: 'YouTube channel updated' },
    400: { content: { 'application/json': { schema: z.union([YouTubeChannelPlatformIdExistsErrorSchema, YouTubeChannelUpdateFailedErrorSchema]) } }, description: 'Invalid input or platform ID conflict' },
    404: { content: { 'application/json': { schema: YouTubeChannelNotFoundErrorSchema } }, description: 'YouTube channel not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates an existing YouTube channel link.',
  tags: ['YouTubeChannels'],
});
youtubeChannelRoutes.openapi(updateChannelRouteDef, updateYouTubeChannelHandler);

// DELETE /youtube-channels/{id} - Delete YouTube Channel
const deleteChannelRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: YouTubeChannelDeleteResponseSchema } }, description: 'YouTube channel deleted' },
    400: { content: { 'application/json': { schema: YouTubeChannelDeleteFailedErrorSchema } }, description: 'Deletion failed (e.g., channel has videos/playlists)' },
    404: { content: { 'application/json': { schema: YouTubeChannelNotFoundErrorSchema } }, description: 'YouTube channel not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes a YouTube channel link.',
  tags: ['YouTubeChannels'],
});
youtubeChannelRoutes.openapi(deleteChannelRouteDef, deleteYouTubeChannelHandler);

export default youtubeChannelRoutes;
