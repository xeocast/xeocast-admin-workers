// src/routes/podcasts.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env';
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
  PodcastStatusSchema,
  PodcastPublicationTypeSchema,
} from '../schemas/podcastSchemas';
import {
  PathIdParamSchema,
  GeneralServerErrorSchema,
  GeneralBadRequestErrorSchema
} from '../schemas/commonSchemas';
import { createPodcastHandler } from '../handlers/podcasts/createPodcast.handler';
import { listPodcastsHandler } from '../handlers/podcasts/listPodcasts.handler';
import { getPodcastByIdHandler } from '../handlers/podcasts/getPodcastById.handler';
import { updatePodcastHandler } from '../handlers/podcasts/updatePodcast.handler';
import { deletePodcastHandler } from '../handlers/podcasts/deletePodcast.handler';

const podcastRoutes = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

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

podcastRoutes.openapi(createPodcastRouteDef, createPodcastHandler);

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
      title: z.string().optional().openapi({ description: 'Filter by podcast title (case-insensitive, partial match).' }),
      type: PodcastPublicationTypeSchema.optional().openapi({ description: "Filter by podcast publication type (e.g., 'evergreen', 'news')." }),
    }).openapi('ListPodcastsQuery'),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ListPodcastsResponseSchema } },
      description: 'A list of podcasts.',
    },
    400: {
      content: { 'application/json': { schema: GeneralBadRequestErrorSchema } },
      description: 'Bad request.',
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

podcastRoutes.openapi(listPodcastsRouteDef, listPodcastsHandler);

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
    400: {
      content: { 'application/json': { schema: GeneralBadRequestErrorSchema } },
      description: 'Bad request.',
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

podcastRoutes.openapi(getPodcastByIdRouteDef, getPodcastByIdHandler);

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
      content: { 'application/json': { schema: GeneralBadRequestErrorSchema } },
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

podcastRoutes.openapi(updatePodcastRouteDef, updatePodcastHandler);

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
    400: {
      content: { 'application/json': { schema: GeneralBadRequestErrorSchema } },
      description: 'Bad request or deletion failed due to constraints.',
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
  summary: 'Deletes a podcast.',
  tags: ['Podcasts'],
});

podcastRoutes.openapi(deletePodcastRouteDef, deletePodcastHandler);

export default podcastRoutes;
