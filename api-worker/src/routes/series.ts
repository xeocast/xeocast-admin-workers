// src/routes/series.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  SeriesCreateRequestSchema,
  SeriesCreateResponseSchema,
  ListSeriesResponseSchema,
  GetSeriesResponseSchema,
  SeriesUpdateRequestSchema,
  SeriesUpdateResponseSchema,
  SeriesDeleteResponseSchema,
  SeriesSchema, // For placeholder in GET by ID and List (if full detail was needed)
  SeriesSummarySchema, // For placeholder in List
  SeriesCreateFailedErrorSchema,
  SeriesNotFoundErrorSchema,
  SeriesUpdateFailedErrorSchema,
  SeriesDeleteFailedErrorSchema
} from '../schemas/seriesSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../schemas/commonSchemas';

const seriesRoutes = new OpenAPIHono();

// POST /series - Create Series
const createSeriesRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: SeriesCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: SeriesCreateResponseSchema } }, description: 'Series created' },
    400: { content: { 'application/json': { schema: SeriesCreateFailedErrorSchema } }, description: 'Invalid input' }, // Can be more specific, e.g. title exists in category
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Creates a new series.',
  tags: ['Series'],
});
seriesRoutes.openapi(createSeriesRouteDef, (c) => {
  const newSeriesData = c.req.valid('json');
  console.log('Create series:', newSeriesData);
  const createdSeriesId = Math.floor(Math.random() * 1000) + 1;
  return c.json({ success: true, message: 'Series created successfully.' as const, seriesId: createdSeriesId }, 201);
});

// GET /series - List Series
const listSeriesRouteDef = createRoute({
  method: 'get',
  path: '/',
  // Add query params for filtering by category_id if needed in future
  responses: {
    200: { content: { 'application/json': { schema: ListSeriesResponseSchema } }, description: 'List of series' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all series.',
  tags: ['Series'],
});
seriesRoutes.openapi(listSeriesRouteDef, (c) => {
  console.log('List series');
  const placeholderSeries = SeriesSummarySchema.parse({
    id: 1,
    title: 'My Awesome Podcast Series',
    category_id: 1,
    youtube_playlist_id: 'PLxxxxxxxxxxxxxxxxx',
  });
  const responsePayload = { success: true, series: [placeholderSeries] };
  return c.json(ListSeriesResponseSchema.parse(responsePayload), 200);
});

// GET /series/{id} - Get Series by ID
const getSeriesByIdRouteDef = createRoute({
  method: 'get',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetSeriesResponseSchema } }, description: 'Series details' },
    404: { content: { 'application/json': { schema: SeriesNotFoundErrorSchema } }, description: 'Series not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets a series by ID.',
  tags: ['Series'],
});
seriesRoutes.openapi(getSeriesByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Get series by ID:', id);
  if (id === '999') { // Simulate not found
    return c.json(SeriesNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'Series not found.' }), 404);
  }
  const placeholderSeries = SeriesSchema.parse({
    id: parseInt(id),
    title: 'Specific Series Title',
    description: 'Detailed description of this specific series.',
    category_id: 1,
    youtube_playlist_id: 'PLyyyyyyyyyyyyyyy',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return c.json({ success: true, series: placeholderSeries }, 200);
});

// PUT /series/{id} - Update Series
const updateSeriesRouteDef = createRoute({
  method: 'put',
  path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: SeriesUpdateRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: SeriesUpdateResponseSchema } }, description: 'Series updated' },
    400: { content: { 'application/json': { schema: SeriesUpdateFailedErrorSchema } }, description: 'Invalid input' },
    404: { content: { 'application/json': { schema: SeriesNotFoundErrorSchema } }, description: 'Series not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates an existing series.',
  tags: ['Series'],
});
seriesRoutes.openapi(updateSeriesRouteDef, (c) => {
  const { id } = c.req.valid('param');
  const updatedSeriesData = c.req.valid('json');
  console.log('Update series:', id, updatedSeriesData);
  if (id === '999') { // Simulate not found
    return c.json(SeriesNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'Series not found.' }), 404);
  }
  return c.json({ success: true, message: 'Series updated successfully.' as const }, 200);
});

// DELETE /series/{id} - Delete Series
const deleteSeriesRouteDef = createRoute({
  method: 'delete',
  path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: SeriesDeleteResponseSchema } }, description: 'Series deleted' },
    400: { content: { 'application/json': { schema: SeriesDeleteFailedErrorSchema } }, description: 'Deletion failed (e.g., series has podcasts)' },
    404: { content: { 'application/json': { schema: SeriesNotFoundErrorSchema } }, description: 'Series not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes a series.',
  tags: ['Series'],
});
seriesRoutes.openapi(deleteSeriesRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Delete series:', id);
  if (id === '999') { // Simulate not found
    return c.json(SeriesNotFoundErrorSchema.parse({ success: false, error: 'not_found', message: 'Series not found.' }), 404);
  }
  // if (id === '1') { // Simulate constraint error
  //   return c.json(SeriesDeleteFailedErrorSchema.parse({ success: false, error: 'delete_failed', message: 'Cannot delete series: It has associated podcasts.' }), 400);
  // }
  return c.json({ success: true, message: 'Series deleted successfully.' as const }, 200);
});

export default seriesRoutes;
