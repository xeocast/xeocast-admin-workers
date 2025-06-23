// src/schemas/youtubePlaylistSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  PaginationInfoSchema // Changed from SimpleListResponseSchema
} from './common.schemas';

// Base schema for YouTube playlist properties
const YouTubePlaylistBaseSchema = z.object({
  series_id: z.number().int().positive()
    .openapi({ example: 1, description: 'The ID of the series this YouTube playlist is associated with.' }),
  channel_id: z.number().int().positive() // Renamed from youtube_channel_id
    .openapi({ example: 1, description: 'The ID of the YouTube channel this playlist belongs to.' }),
  youtube_platform_id: z.string().min(1).max(100)
    .openapi({ example: 'PLxxxxxxxxxxxxxxxxx', description: 'The unique YouTube Playlist ID (platform ID).' }),
  title: z.string().min(1).max(255)
    .openapi({ example: 'My Awesome Series Playlist', description: 'The title of the YouTube playlist.' }),
  description: z.string().max(5000) // Made non-nullable and required, removed .nullable().optional()
    .openapi({ example: 'All episodes of My Awesome Series.', description: 'A description for the YouTube playlist.' }),
  // thumbnail_url removed as it's not in the DB schema
}).openapi('YouTubePlaylistBase');

// Full YouTubePlaylist schema for API responses
export const YouTubePlaylistSchema = YouTubePlaylistBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1, description: 'Unique identifier for the YouTube playlist record.' }),
  created_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of creation.' }),
  updated_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of last update.' }),
}).openapi('YouTubePlaylist');

// Schema for creating a new YouTube playlist
export const YouTubePlaylistCreateRequestSchema = YouTubePlaylistBaseSchema;

export const YouTubePlaylistCreateResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'YouTube playlist created successfully.' }),
  id: z.number().int().positive().openapi({ example: 101 }),
}).openapi('YouTubePlaylistCreateResponse');

// Enum for sortable fields for YouTube Playlists
export const YouTubePlaylistSortBySchema = z.enum([
  'id',
  'title',
  'series_id',
  'channel_id',
  'created_at',
  'updated_at'
]).openapi({ description: 'Field to sort YouTube playlists by.', example: 'title' });

// Enum for sort order
export const SortOrderSchema = z.enum(['asc', 'desc']).openapi({ description: 'Sort order.', example: 'asc' });

// Schema for query parameters when listing YouTube playlists
export const ListYouTubePlaylistsQuerySchema = z.preprocess(
  (query: unknown) => {
    if (typeof query !== 'object' || query === null) {
      return query;
    }
    const q = query as Record<string, unknown>;
    const processed = { ...q };
    if (q.per_page) processed.limit = q.per_page;
    if (q.sort_by) processed.sortBy = q.sort_by;
    if (q.sort_order) processed.sortOrder = q.sort_order;
    return processed;
  },
  z.object({
    page: z.string().optional()
      .transform(val => val ? parseInt(val, 10) : 1)
      .pipe(z.number().int().positive().default(1))
      .openapi({ description: 'Page number for pagination.', example: '1' }),
    limit: z.string().optional()
      .transform(val => val ? parseInt(val, 10) : 10)
      .pipe(z.number().int().positive().default(10))
      .openapi({ description: 'Number of items per page.', example: '10' }),
    title: z.string().optional()
      .openapi({ description: 'Filter by playlist title (case-insensitive, partial match).', example: 'Awesome Playlist' }),
    series_id: z.string().optional()
      .transform(val => val ? parseInt(val, 10) : undefined)
      .pipe(z.number().int().positive().optional())
      .openapi({ description: 'Filter by series ID.', example: '1' }),
    channel_id: z.string().optional()
      .transform(val => val ? parseInt(val, 10) : undefined)
      .pipe(z.number().int().positive().optional())
      .openapi({ description: 'Filter by YouTube channel ID.', example: '1' }),
    sortBy: YouTubePlaylistSortBySchema.optional().default('title')
      .openapi({ description: 'Field to sort YouTube playlists by.', example: 'title' }),
    sortOrder: SortOrderSchema.optional().default('asc')
      .openapi({ description: 'Sort order (asc/desc).', example: 'asc' }),
  })
).openapi('ListYouTubePlaylistsQuery');

// Schema for listing YouTube playlists
export const ListYouTubePlaylistsResponseSchema = z.object({
  playlists: z.array(YouTubePlaylistSchema),
  pagination: PaginationInfoSchema,
}).openapi('ListYouTubePlaylistsResponse');

// Schema for getting a single YouTube playlist
export const GetYouTubePlaylistResponseSchema = z.object({
  playlist: YouTubePlaylistSchema
}).openapi('GetYouTubePlaylistResponse');

// Schema for updating a YouTube playlist
// Includes youtube_platform_id as per the PUT /youtube-playlists/{id}/update-platform-id spec implies it can be updated.
export const YouTubePlaylistUpdateRequestSchema = YouTubePlaylistBaseSchema.partial().openapi('YouTubePlaylistUpdateRequest');

export const YouTubePlaylistUpdateResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'YouTube playlist updated successfully.' })
}).openapi('YouTubePlaylistUpdateResponse');

// Schema for specifically updating the youtube_platform_id (if a dedicated route is desired)
export const YouTubePlaylistUpdatePlatformIdRequestSchema = z.object({
    youtube_platform_id: z.string().min(1).max(100)
        .openapi({ example: 'PLnewxxxxxxxxxxxx', description: 'The new YouTube Playlist ID (platform ID).' }),
}).openapi('YouTubePlaylistUpdatePlatformIdRequest');

// Schema for deleting a YouTube playlist
export const YouTubePlaylistDeleteResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'YouTube playlist deleted successfully.' })
}).openapi('YouTubePlaylistDeleteResponse');

// --- Specific Error Schemas for YouTube Playlists ---
export const YouTubePlaylistPlatformIdExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'YouTube playlist platform ID already exists for this channel.' })
}).openapi('YouTubePlaylistPlatformIdExistsError');

export const YouTubePlaylistCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Failed to create YouTube playlist.' })
}).openapi('YouTubePlaylistCreateFailedError');

export const YouTubePlaylistUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Failed to update YouTube playlist.' })
}).openapi('YouTubePlaylistUpdateFailedError');

export const YouTubePlaylistDeleteFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Cannot delete YouTube Playlist: It has associated videos.' })
}).openapi('YouTubePlaylistDeleteFailedError');

export const YouTubePlaylistNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
  message: z.string().openapi({ example: 'YouTube playlist not found.' })
}).openapi('YouTubePlaylistNotFoundError');
