// src/schemas/seriesSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema
} from './commonSchemas';

// Base schema for series properties
const SeriesBaseSchema = z.object({
  title: z.string().min(1).max(255)
    .openapi({ example: 'My Awesome Podcast Series', description: 'The title of the series.' }),
  description: z.string().max(5000).optional()
    .openapi({ example: 'A series about interesting topics.', description: 'A detailed description of the series.' }),
  category_id: z.number().int().positive()
    .openapi({ example: 1, description: 'The ID of the category this series belongs to.' }),
  youtube_playlist_id: z.string().max(100).nullable().optional() // YouTube Playlist ID can be null or not set initially
    .openapi({ example: 'PLxxxxxxxxxxxxxxxxx', description: 'The YouTube Playlist ID associated with this series.' }),
}).openapi('SeriesBase');

// Full Series schema for API responses
export const SeriesSchema = SeriesBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1, description: 'Unique identifier for the series.' }),
  created_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of when the series was created.' }),
  updated_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of when the series was last updated.' }),
}).openapi('Series');

// Schema for creating a new series
export const SeriesCreateRequestSchema = SeriesBaseSchema;

export const SeriesCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Series created successfully.'),
  seriesId: z.number().int().positive().openapi({ example: 101 }),
}).openapi('SeriesCreateResponse');

// Schema for the summary of a series, used in lists
export const SeriesSummarySchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'My Awesome Podcast Series' }),
  category_id: z.number().int().positive().openapi({ example: 1 }),
  youtube_playlist_id: z.string().max(100).nullable().optional().openapi({ example: 'PLxxxxxxxxxxxxxxxxx' }),
}).openapi('SeriesSummary');

// Schema for listing series
export const ListSeriesResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  series: z.array(SeriesSummarySchema) // Using SeriesSummarySchema for lists
}).openapi('ListSeriesResponse');

// Schema for getting a single series
export const GetSeriesResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  series: SeriesSchema
}).openapi('GetSeriesResponse');

// Schema for updating a series
// For PUT, typically all optional fields from base can be updated.
// If youtube_playlist_id is meant to be cleared, sending null is appropriate.
export const SeriesUpdateRequestSchema = SeriesBaseSchema.partial().openapi('SeriesUpdateRequest');

export const SeriesUpdateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Series updated successfully.')
}).openapi('SeriesUpdateResponse');

// Schema for deleting a series
export const SeriesDeleteResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Series deleted successfully.')
}).openapi('SeriesDeleteResponse');

// --- Specific Error Schemas for Series ---
export const SeriesCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.literal('Failed to create series.')
  // Add specific field errors if needed, e.g., title_exists_in_category
}).openapi('SeriesCreateFailedError');

export const SeriesUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.literal('Failed to update series.')
}).openapi('SeriesUpdateFailedError');

export const SeriesDeleteFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Cannot delete series: It has associated podcasts.' })
}).openapi('SeriesDeleteFailedError');

export const SeriesNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
  message: z.literal('Series not found.')
}).openapi('SeriesNotFoundError');
