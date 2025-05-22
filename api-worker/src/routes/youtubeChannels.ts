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
youtubeChannelRoutes.openapi(createChannelRouteDef, (c) => {
  const newChannelData = c.req.valid('json');
  console.log('Create YouTube channel:', newChannelData);
  // Placeholder: Check for existing youtube_platform_id
  // if (newChannelData.youtube_platform_id === 'EXISTING_ID') {
  //   return c.json(YouTubeChannelPlatformIdExistsErrorSchema.parse({ success: false, error: 'platform_id_exists', message: 'YouTube platform ID already exists.' }), 400);
  // }
  const createdChannelId = Math.floor(Math.random() * 1000) + 1;
  return c.json({ success: true, message: 'YouTube channel created successfully.' as const, channelId: createdChannelId }, 201);
});

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
youtubeChannelRoutes.openapi(listChannelsRouteDef, (c) => {
  const { category_id } = c.req.valid('query');
  console.log('List YouTube channels - Query Params:', { category_id });

  const placeholderChannel = YouTubeChannelSchema.parse({
    id: 1,
    category_id: category_id || 1,
    youtube_platform_id: 'UCexamplechannel123',
    name: 'Sample Channel',
    description: 'This is a sample YouTube channel.',
    custom_url: '@SampleChannel',
    thumbnail_url: 'https://yt3.ggpht.com/sample_thumbnail.jpg',
    default_language: 'en-US',
    default_category_id_on_youtube: '22',
    prompt_template_for_title: 'Video Title: {topic}',
    prompt_template_for_description: 'Video Description: {details}',
    prompt_template_for_tags: 'tag1, tag2, {topic_tag}',
    prompt_template_for_first_comment: 'First comment: {engagement_question}',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const responsePayload = { success: true, channels: [placeholderChannel] };
  return c.json(ListYouTubeChannelsResponseSchema.parse(responsePayload), 200);
});

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
youtubeChannelRoutes.openapi(getChannelByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Get YouTube channel by ID:', id);
  if (id === '999') { // Simulate not found
    return c.json(YouTubeChannelNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'YouTube channel not found.' }), 404);
  }
  const placeholderChannel = YouTubeChannelSchema.parse({
    id: parseInt(id),
    category_id: 1,
    youtube_platform_id: 'UCanotherchannel789',
    name: 'Another Sample Channel',
    description: 'Details about this other channel.',
    custom_url: '@AnotherChannel',
    thumbnail_url: 'https://yt3.ggpht.com/another_thumbnail.jpg',
    default_language: 'es-ES',
    default_category_id_on_youtube: '24',
    prompt_template_for_title: null,
    prompt_template_for_description: null,
    prompt_template_for_tags: null,
    prompt_template_for_first_comment: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return c.json({ success: true, channel: placeholderChannel }, 200);
});

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
youtubeChannelRoutes.openapi(updateChannelRouteDef, (c) => {
  const { id } = c.req.valid('param');
  const updatedChannelData = c.req.valid('json');
  console.log('Update YouTube channel:', id, updatedChannelData);
  if (id === '999') { // Simulate not found
    return c.json(YouTubeChannelNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'YouTube channel not found.' }), 404);
  }
  // Placeholder: Check for existing youtube_platform_id if it's being changed and is not the current one
  return c.json({ success: true, message: 'YouTube channel updated successfully.' as const }, 200);
});

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
youtubeChannelRoutes.openapi(deleteChannelRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Delete YouTube channel:', id);
  if (id === '999') { // Simulate not found
    return c.json(YouTubeChannelNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'YouTube channel not found.' }), 404);
  }
  // if (id === '1' && channel_has_dependencies) { // Simulate constraint error
  //   return c.json(YouTubeChannelDeleteFailedErrorSchema.parse({ success: false, error: 'delete_failed', message: 'Cannot delete YouTube Channel: It is referenced by existing YouTube videos or playlists.' }), 400);
  // }
  return c.json({ success: true, message: 'YouTube channel deleted successfully.' as const }, 200);
});

export default youtubeChannelRoutes;
