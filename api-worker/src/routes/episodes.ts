// src/routes/episodes.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env';
import {
  EpisodeCreateRequestSchema,
  EpisodeCreateResponseSchema,
  ListEpisodesResponseSchema,
  GetEpisodeResponseSchema,
  EpisodeUpdateRequestSchema,
  EpisodeUpdateResponseSchema,
  EpisodeDeleteResponseSchema,
  EpisodeCreateFailedErrorSchema,
  EpisodeNotFoundErrorSchema,
  EpisodeUpdateFailedErrorSchema,
  EpisodeDeleteFailedErrorSchema,
  EpisodeSchema, // For placeholder data
  EpisodeStatusSchema,
  EpisodePublicationTypeSchema,
  EpisodeSortBySchema, // Added for sorting
  SortOrderSchema, // Added for sorting
} from '../schemas/episodeSchemas';
import {
  PathIdParamSchema,
  GeneralServerErrorSchema,
  GeneralBadRequestErrorSchema
} from '../schemas/commonSchemas';
import { createEpisodeHandler } from '../handlers/episodes/createEpisode.handler';
import { listEpisodesHandler } from '../handlers/episodes/listEpisodes.handler';
import { getEpisodeByIdHandler } from '../handlers/episodes/getEpisodeById.handler';
import { updateEpisodeHandler } from '../handlers/episodes/updateEpisode.handler';
import { deleteEpisodeHandler } from '../handlers/episodes/deleteEpisode.handler';

const episodeRoutes = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

// POST /episodes
const createEpisodeRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: { 'application/json': { schema: EpisodeCreateRequestSchema } },
      description: 'Data for the new episode.',
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: EpisodeCreateResponseSchema } },
      description: 'Episode created successfully.',
    },
    400: {
      content: { 'application/json': { schema: EpisodeCreateFailedErrorSchema } },
      description: 'Invalid input (e.g., validation errors, invalid show/series ID).',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Creates a new episode.',
  description: 'Creates a new episode with the provided details. Status defaults to "draft" if not specified.',
  tags: ['Episodes'],
});

episodeRoutes.openapi(createEpisodeRouteDef, createEpisodeHandler);

// GET /episodes
const listEpisodesRouteDef = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: z.object({
      page: z.string().optional().openapi({ example: '1', description: 'Page number for pagination.' }),
      limit: z.string().optional().openapi({ example: '10', description: 'Number of items per page.' }),
      status: EpisodeStatusSchema.optional().openapi({ description: 'Filter by episode status.' }),
      show_id: z.string().optional().openapi({ description: 'Filter by show ID.' }), // Assuming string for ID from query
      series_id: z.string().optional().openapi({ description: 'Filter by series ID.' }), // Assuming string for ID from query
      title: z.string().optional().openapi({ description: 'Filter by episode title (case-insensitive, partial match).' }),
      type: EpisodePublicationTypeSchema.optional().openapi({ description: "Filter by episode publication type (e.g., 'evergreen', 'news')." }),
      sortBy: EpisodeSortBySchema.optional().openapi({ description: 'Field to sort episodes by. Defaults to created_at.' }),
      sortOrder: SortOrderSchema.optional().openapi({ description: 'Sort order (asc/desc). Defaults to desc.' }),
    }).openapi('ListEpisodesQuery'),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ListEpisodesResponseSchema } },
      description: 'A list of episodes.',
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
  summary: 'Lists all episodes.',
  description: 'Retrieves a list of all episodes. Supports pagination and filtering.',
  tags: ['Episodes'],
});

episodeRoutes.openapi(listEpisodesRouteDef, listEpisodesHandler);

// GET /episodes/{id}
const getEpisodeByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetEpisodeResponseSchema } },
      description: 'Details of the episode.',
    },
    400: {
      content: { 'application/json': { schema: GeneralBadRequestErrorSchema } },
      description: 'Bad request.',
    },
    404: {
      content: { 'application/json': { schema: EpisodeNotFoundErrorSchema } },
      description: 'Episode not found.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Gets a specific episode by its ID.',
  tags: ['Episodes'],
});

episodeRoutes.openapi(getEpisodeByIdRouteDef, getEpisodeByIdHandler);

// PUT /episodes/{id}
const updateEpisodeRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: {
      content: { 'application/json': { schema: EpisodeUpdateRequestSchema } },
      description: 'Data to update for the episode.',
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: EpisodeUpdateResponseSchema } },
      description: 'Episode updated successfully.',
    },
    400: {
      content: { 'application/json': { schema: GeneralBadRequestErrorSchema } },
      description: 'Invalid input (e.g., validation errors, invalid show/series ID).',
    },
    404: {
      content: { 'application/json': { schema: EpisodeNotFoundErrorSchema } }, 
      description: 'Episode not found or no changes made.',
    },
    500: {
      content: { 'application/json': { schema: GeneralServerErrorSchema } },
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Updates an existing episode.',
  tags: ['Episodes'],
});

episodeRoutes.openapi(updateEpisodeRouteDef, updateEpisodeHandler);

// DELETE /episodes/{id}
const deleteEpisodeRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: EpisodeDeleteResponseSchema } },
      description: 'Episode deleted successfully.',
    },
    400: {
      content: { 'application/json': { schema: GeneralBadRequestErrorSchema } },
      description: 'Bad request or deletion failed due to constraints.',
    },
    404: {
      content: { 'application/json': { schema: EpisodeNotFoundErrorSchema } },
      description: 'Episode not found.',
    },
    500: { 
      content: { 'application/json': { schema: GeneralServerErrorSchema } }, 
      description: 'An unexpected error occurred.',
    },
  },
  summary: 'Deletes a episode.',
  tags: ['Episodes'],
});

episodeRoutes.openapi(deleteEpisodeRouteDef, deleteEpisodeHandler);

export default episodeRoutes;
