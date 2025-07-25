// src/routes/youtubeChannels.ts
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env';
import {
  YouTubeChannelCreateRequestSchema,
  YouTubeChannelCreateResponseSchema,
  ListYouTubeChannelsQuerySchema,
  ListYouTubeChannelsResponseSchema,
  GetYouTubeChannelResponseSchema,
  YouTubeChannelUpdateRequestSchema,
  YouTubeChannelUpdateResponseSchema,
  YouTubeChannelDeleteResponseSchema,
  YouTubeChannelPlatformIdExistsErrorSchema,
  YouTubeChannelCreateFailedErrorSchema,
  YouTubeChannelNotFoundErrorSchema,
  YouTubeChannelUpdateFailedErrorSchema,
  YouTubeChannelDeleteFailedErrorSchema
} from '../schemas/youtube-channel.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../schemas/common.schemas';
import { createYouTubeChannelHandler } from '../handlers/youtube-channels/create-youtube-channel.handler';
import { listYouTubeChannelsHandler } from '../handlers/youtube-channels/list-youtube-channels.handler';
import { getYouTubeChannelByIdHandler } from '../handlers/youtube-channels/get-youtube-channel-by-id.handler';
import { updateYouTubeChannelHandler } from '../handlers/youtube-channels/update-youtube-channel.handler';
import { deleteYouTubeChannelHandler } from '../handlers/youtube-channels/delete-youtube-channel.handler';

const youtubeChannelRoutes = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

// POST /youtube-channels - Create YouTube Channel
const createChannelRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: YouTubeChannelCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: YouTubeChannelCreateResponseSchema } }, description: 'YouTube channel created' },
    400: { content: { 'application/json': { schema: YouTubeChannelCreateFailedErrorSchema } }, description: 'Invalid input' },
    404: { content: { 'application/json': { schema: YouTubeChannelNotFoundErrorSchema } }, description: 'Related show not found' },
    409: { content: { 'application/json': { schema: YouTubeChannelPlatformIdExistsErrorSchema } }, description: 'Platform ID exists' },
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
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Bad request (e.g., invalid query parameters)' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists YouTube channels with pagination and optional filtering.',
  description: 'Retrieves a paginated list of YouTube channels. Supports filtering by show ID, title (case-insensitive partial match), and language code.',
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
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Bad request (e.g., invalid ID format)' },
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
    400: { content: { 'application/json': { schema: YouTubeChannelUpdateFailedErrorSchema } }, description: 'Invalid input' },
    404: { content: { 'application/json': { schema: YouTubeChannelNotFoundErrorSchema } }, description: 'YouTube channel not found' },
    409: { content: { 'application/json': { schema: YouTubeChannelPlatformIdExistsErrorSchema } }, description: 'Platform ID conflict' },
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
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Bad request (e.g., invalid ID format)' },
    404: { content: { 'application/json': { schema: YouTubeChannelNotFoundErrorSchema } }, description: 'YouTube channel not found' },
    409: { content: { 'application/json': { schema: YouTubeChannelDeleteFailedErrorSchema } }, description: 'Deletion conflict' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes a YouTube channel link.',
  tags: ['YouTubeChannels'],
});
youtubeChannelRoutes.openapi(deleteChannelRouteDef, deleteYouTubeChannelHandler);

export default youtubeChannelRoutes;
