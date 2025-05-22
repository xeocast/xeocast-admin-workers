// src/routes/podcasts.ts
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { Context } from 'hono';
import {
  PodcastCreateRequestSchema,
  PodcastCreateResponseSchema,
  ListPodcastsResponseSchema,
  GetPodcastResponseSchema,
  PodcastUpdateRequestSchema,
  PodcastUpdateResponseSchema,
  PodcastDeleteResponseSchema,
  PodcastCreateFailedErrorSchema,
  PodcastNotFoundErrorSchema,
  PodcastUpdateFailedErrorSchema,
  PodcastDeleteFailedErrorSchema,
  PodcastSchema, // For placeholder data
  PodcastStatusSchema
} from '../schemas/podcastSchemas';
import {
  PathIdParamSchema,
  GeneralServerErrorSchema
} from '../schemas/commonSchemas';

const podcastRoutes = new OpenAPIHono();

// POST /podcasts
const createPodcastRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: { 'application/json': { schema: PodcastCreateRequestSchema } },
      description: 'Data for the new podcast.',
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: PodcastCreateResponseSchema } },
      description: 'Podcast created successfully.',
    },
    400: {
      content: { 'application/json': { schema: PodcastCreateFailedErrorSchema } },
      description: 'Invalid input (e.g., validation errors, invalid category/series ID).',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Creates a new podcast.',
  description: 'Creates a new podcast with the provided details. Status defaults to "draft" if not specified.',
  tags: ['Podcasts'],
});

podcastRoutes.openapi(createPodcastRouteDef, (c) => {
  // const body = c.req.valid('json');
  return c.json({ success: true, message: 'Podcast created successfully.' as const, podcastId: 101 }, 201);
});

// GET /podcasts
const listPodcastsRouteDef = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: z.object({
      page: z.string().optional().openapi({ example: '1', description: 'Page number for pagination.' }),
      limit: z.string().optional().openapi({ example: '10', description: 'Number of items per page.' }),
      status: PodcastStatusSchema.optional().openapi({ description: 'Filter by podcast status.' }),
      category_id: z.string().optional().openapi({ description: 'Filter by category ID.' }), // Assuming string for ID from query
      series_id: z.string().optional().openapi({ description: 'Filter by series ID.' }), // Assuming string for ID from query
    }).openapi('ListPodcastsQuery'),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ListPodcastsResponseSchema } },
      description: 'A list of podcasts.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Lists all podcasts.',
  description: 'Retrieves a list of all podcasts. Supports pagination and filtering.',
  tags: ['Podcasts'],
});

podcastRoutes.openapi(listPodcastsRouteDef, (c) => {
  // const query = c.req.valid('query');
  const placeholderPodcast = PodcastSchema.parse({
    id: 1,
    title: 'Sample Podcast Episode',
    description: 'This is a sample episode.',
    markdown_content: '# Sample',
    category_id: 1,
    series_id: 1,
    status: 'published',
    scheduled_publish_at: null,
    slug: 'sample-podcast-episode',
    audio_bucket_key: 'audio.mp3',
    video_bucket_key: 'video.mp4',
    thumbnail_bucket_key: 'thumb.png',
    duration_seconds: 1800,
    youtube_video_id: 'ytvid',
    youtube_playlist_id: 'ytplaylist',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  });
  return c.json({ success: true, podcasts: [placeholderPodcast] }, 200);
});

// GET /podcasts/{id}
const getPodcastByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetPodcastResponseSchema } },
      description: 'Details of the podcast.',
    },
    404: {
      content: { 'application/json': { schema: PodcastNotFoundErrorSchema } },
      description: 'Podcast not found.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Gets a specific podcast by its ID.',
  tags: ['Podcasts'],
});

podcastRoutes.openapi(getPodcastByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  if (id === '1') { 
    const placeholderPodcast = PodcastSchema.parse({
        id: parseInt(id as string),
        title: 'Fetched Podcast Episode',
        description: 'Details for fetched episode.',
        markdown_content: '# Fetched',
        category_id: 1,
        series_id: 1,
        status: 'published',
        scheduled_publish_at: null,
        slug: 'fetched-podcast-episode',
        audio_bucket_key: 'audio_fetched.mp3',
        video_bucket_key: 'video_fetched.mp4',
        thumbnail_bucket_key: 'thumb_fetched.png',
        duration_seconds: 2000,
        youtube_video_id: 'ytvid_fetched',
        youtube_playlist_id: 'ytplaylist_fetched',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      });
    return c.json({ success: true, podcast: placeholderPodcast }, 200);
  }
  return c.json(PodcastNotFoundErrorSchema.parse({ success: false, message: 'Podcast not found.'}), 404);
});

// PUT /podcasts/{id}
const updatePodcastRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: {
      content: { 'application/json': { schema: PodcastUpdateRequestSchema } },
      description: 'Data to update for the podcast.',
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: PodcastUpdateResponseSchema } },
      description: 'Podcast updated successfully.',
    },
    400: {
      content: { 'application/json': { schema: PodcastUpdateFailedErrorSchema } },
      description: 'Invalid input (e.g., validation errors, invalid category/series ID).',
    },
    404: {
      content: { 'application/json': { schema: PodcastNotFoundErrorSchema } }, 
      description: 'Podcast not found or no changes made.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Updates an existing podcast.',
  tags: ['Podcasts'],
});

podcastRoutes.openapi(updatePodcastRouteDef, (c) => {
  const { id } = c.req.valid('param');
  // const body = c.req.valid('json');
  if (id === '1') { 
    return c.json({ success: true, message: 'Podcast updated successfully.' as const }, 200);
  }
  return c.json(PodcastNotFoundErrorSchema.parse({ success: false, message: 'Podcast not found.'}), 404);
});

// DELETE /podcasts/{id}
const deletePodcastRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: PodcastDeleteResponseSchema } },
      description: 'Podcast deleted successfully.',
    },
    404: {
      content: { 'application/json': { schema: PodcastNotFoundErrorSchema } },
      description: 'Podcast not found.',
    },
    500: { 
      content: { 'application/json': { schema: PodcastDeleteFailedErrorSchema } }, // API spec does not specify a 400 for delete constraints
      description: 'An unexpected error occurred or deletion failed due to constraints.',
    },
  },
  summary: 'Deletes a podcast.',
  tags: ['Podcasts'],
});

podcastRoutes.openapi(deletePodcastRouteDef, (c) => {
  const { id } = c.req.valid('param');
  if (id === '1') { 
     return c.json({ success: true, message: 'Podcast deleted successfully.' as const }, 200);
  }
  return c.json(PodcastNotFoundErrorSchema.parse({ success: false, message: 'Podcast not found.'}), 404);
});

export default podcastRoutes;
