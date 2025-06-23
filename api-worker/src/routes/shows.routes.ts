// src/routes/shows.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env';
import {
  ShowCreateRequestSchema,
  ShowCreateResponseSchema,
  ListShowsQuerySchema, // Added
  ListShowsResponseSchema,
  GetShowResponseSchema,
  ShowUpdateRequestSchema,
  ShowUpdateResponseSchema,
  ShowDeleteResponseSchema,
  ShowNameExistsErrorSchema,
  ShowCreateFailedErrorSchema,
  ShowNotFoundErrorSchema,
  ShowUpdateFailedErrorSchema,
  ShowDeleteFailedErrorSchema
} from '../schemas/show.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../schemas/common.schemas';
import { createShowHandler } from '../handlers/shows/create-show.handler';
import { listShowsHandler } from '../handlers/shows/list-shows.handler';
import { getShowByIdHandler } from '../handlers/shows/get-show-by-id.handler';
import { updateShowHandler } from '../handlers/shows/update-show.handler';
import { deleteShowHandler } from '../handlers/shows/delete-show.handler';

const showRoutes = new OpenAPIHono<{ Bindings: CloudflareEnv }>(); // Typed with CloudflareEnv

// POST /shows
const createShowRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: ShowCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: ShowCreateResponseSchema } }, description: 'Show created' },
    400: { content: { 'application/json': { schema: z.union([ShowNameExistsErrorSchema, ShowCreateFailedErrorSchema]) } }, description: 'Invalid input' },
    500: { content: { 'application/json': { schema: ShowCreateFailedErrorSchema } }, description: 'Server error' },
  },
  summary: 'Creates a new show.', tags: ['Shows'],
});
showRoutes.openapi(createShowRouteDef, createShowHandler);

// GET /shows
const listShowsRouteDef = createRoute({
  method: 'get', path: '/',
  request: {
    query: ListShowsQuerySchema,
  },
  responses: {
    200: { content: { 'application/json': { schema: ListShowsResponseSchema } }, description: 'List of shows' },
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Invalid query parameters' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all shows.', 
  description: 'Retrieves a list of all shows. Supports pagination and filtering by name and language code.',
  tags: ['Shows'],
});
showRoutes.openapi(listShowsRouteDef, listShowsHandler);

// GET /shows/{id}
const getShowByIdRouteDef = createRoute({
  method: 'get', path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetShowResponseSchema } }, description: 'Show details' },
    400: { content: { 'application/json': { schema: GeneralBadRequestErrorSchema } }, description: 'Invalid request' }, // Added GeneralBadRequestErrorSchema
    404: { content: { 'application/json': { schema: ShowNotFoundErrorSchema } }, description: 'Not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets a show by ID.', tags: ['Shows'],
});
showRoutes.openapi(getShowByIdRouteDef, getShowByIdHandler);

// PUT /shows/{id}
const updateShowRouteDef = createRoute({
  method: 'put', path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: ShowUpdateRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: ShowUpdateResponseSchema } }, description: 'Show updated' },
    400: { content: { 'application/json': { schema: z.union([ShowNameExistsErrorSchema, ShowUpdateFailedErrorSchema, GeneralBadRequestErrorSchema]) } }, description: 'Invalid input' }, // Added GeneralBadRequestErrorSchema
    404: { content: { 'application/json': { schema: ShowNotFoundErrorSchema } }, description: 'Not found' },
    500: { content: { 'application/json': { schema: ShowUpdateFailedErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates a show.', tags: ['Shows'],
});
showRoutes.openapi(updateShowRouteDef, updateShowHandler);

// DELETE /shows/{id}
const deleteShowRouteDef = createRoute({
  method: 'delete', path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: ShowDeleteResponseSchema } }, description: 'Show deleted' },
    400: { content: { 'application/json': { schema: ShowDeleteFailedErrorSchema } }, description: 'Deletion failed (e.g. constraints)' },
    404: { content: { 'application/json': { schema: ShowNotFoundErrorSchema } }, description: 'Not found' },
    500: { content: { 'application/json': { schema: ShowDeleteFailedErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes a show.', tags: ['Shows'],
});
showRoutes.openapi(deleteShowRouteDef, deleteShowHandler);

export default showRoutes;
