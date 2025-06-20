// src/schemas/youtubeChannelSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  PaginatedResponseSchema,
  PaginationQuerySchema, // For request query params
  PaginationInfoSchema // For response body
} from './commonSchemas';

// Base schema for YouTube channel properties
const YouTubeChannelBaseSchema = z.object({
  show_id: z.number().int().positive()
    .openapi({ example: 1, description: 'The ID of the show this YouTube channel is associated with.' }),
  youtube_platform_id: z.string().min(1).max(100)
    .openapi({ example: 'UCxxxxxxxxxxxxxxxxx', description: 'The unique YouTube Channel ID (platform ID).' }),
  youtube_platform_category_id: z.string().max(50)
    .openapi({ example: '22', description: 'Default YouTube category ID for videos (e.g., People & Blogs is 22).' }),
  title: z.string().min(1).max(255)
    .openapi({ example: 'My Awesome Channel', description: 'The title (name) of the YouTube channel.' }),
  description: z.string().max(5000)
    .openapi({ example: 'Channel discussing interesting topics.', description: 'A description for the YouTube channel.' }),
  video_description_template: z.string().max(10000)
    .openapi({ example: 'In this episode, we discuss {topic_details}.\n\nKeywords: {keywords}', description: 'Template for generating video descriptions.' }),
  first_comment_template: z.string().max(2000)
    .openapi({ example: 'Join the discussion! What are your thoughts on {topic}?', description: 'Template for the first comment on videos.' }),
  language_code: z.string().length(2)
    .openapi({ example: 'en', description: 'Language code for the channel (ISO 639-1 alpha-2 code).' }),
}).openapi('YouTubeChannelBase');

// Full YouTubeChannel schema for API responses
export const YouTubeChannelSchema = YouTubeChannelBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1, description: 'Unique identifier for the YouTube channel record.' }),
  created_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of creation.' }),
  updated_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z', description: 'Timestamp of last update.' }),
}).openapi('YouTubeChannel');

// Schema for creating a new YouTube channel
export const YouTubeChannelCreateRequestSchema = YouTubeChannelBaseSchema;

export const YouTubeChannelCreateResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'YouTube channel created successfully.' }),
  channelId: z.number().int().positive().openapi({ example: 101 }),
}).openapi('YouTubeChannelCreateResponse');

// Enum for sortable fields for YouTube Channels
export const YouTubeChannelSortBySchema = z.enum([
  'id',
  'title',
  'show_id',
  'language_code',
  'created_at',
  'updated_at'
]).openapi({ description: 'Field to sort YouTube channels by.', example: 'title' });

// Enum for sort order
export const SortOrderSchema = z.enum(['asc', 'desc']).openapi({ description: 'Sort order.', example: 'asc' });

// Schema for query parameters when listing YouTube channels
export const ListYouTubeChannelsQuerySchema = PaginationQuerySchema.extend({
  show_id: z.string().optional()
    .transform(val => val ? parseInt(val, 10) : undefined)
    .pipe(z.number().int().positive().optional())
    .openapi({ description: 'Filter by show ID.', example: '1' }),
  title: z.string().optional()
    .openapi({ description: 'Filter by YouTube channel title (case-insensitive, partial match).', example: 'Awesome Channel' }),
  language_code: z.string().optional()
    .openapi({ description: 'Filter by language code (ISO 639-1 alpha-2 code).', example: 'en' }),
  sortBy: YouTubeChannelSortBySchema.optional().default('title')
    .openapi({ description: 'Field to sort YouTube channels by.', example: 'title' }),
  sortOrder: SortOrderSchema.optional().default('asc')
    .openapi({ description: 'Sort order (asc/desc).', example: 'asc' }),
}).openapi('ListYouTubeChannelsQuery');

// Schema for listing YouTube channels
export const ListYouTubeChannelsResponseSchema = PaginatedResponseSchema(YouTubeChannelSchema, 'channels')
  .openapi('ListYouTubeChannelsResponse');

// Schema for getting a single YouTube channel
export const GetYouTubeChannelResponseSchema = z.object({
  channel: YouTubeChannelSchema
}).openapi('GetYouTubeChannelResponse');

// Schema for updating a YouTube channel
export const YouTubeChannelUpdateRequestSchema = YouTubeChannelBaseSchema.partial().openapi('YouTubeChannelUpdateRequest');

export const YouTubeChannelUpdateResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'YouTube channel updated successfully.' })
}).openapi('YouTubeChannelUpdateResponse');

// Schema for deleting a YouTube channel
export const YouTubeChannelDeleteResponseSchema = MessageResponseSchema.extend({
  message: z.string().openapi({ example: 'YouTube channel deleted successfully.' })
}).openapi('YouTubeChannelDeleteResponse');

// --- Specific Error Schemas for YouTube Channels ---
export const YouTubeChannelPlatformIdExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'YouTube platform ID already exists.' })
}).openapi('YouTubeChannelPlatformIdExistsError');

export const YouTubeChannelCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Failed to create YouTube channel.' })
}).openapi('YouTubeChannelCreateFailedError');

export const YouTubeChannelUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Failed to update YouTube channel.' })
}).openapi('YouTubeChannelUpdateFailedError');

export const YouTubeChannelDeleteFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.string().openapi({ example: 'Cannot delete YouTube Channel: It is referenced by existing YouTube videos or playlists.' })
}).openapi('YouTubeChannelDeleteFailedError');

export const YouTubeChannelNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
  message: z.string().openapi({ example: 'YouTube channel not found.' })
}).openapi('YouTubeChannelNotFoundError');
