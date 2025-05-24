// src/schemas/youtubeChannelSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  SimpleListResponseSchema // Using SimpleList for now, can switch to Paginated if needed
} from './commonSchemas';

// Base schema for YouTube channel properties
const YouTubeChannelBaseSchema = z.object({
  category_id: z.number().int().positive()
    .openapi({ example: 1, description: 'The ID of the category this YouTube channel is associated with.' }),
  youtube_platform_id: z.string().min(1).max(100)
    .openapi({ example: 'UCxxxxxxxxxxxxxxxxx', description: 'The unique YouTube Channel ID (platform ID).' }),
  name: z.string().min(1).max(255)
    .openapi({ example: 'My Awesome Channel', description: 'The name of the YouTube channel.' }),
  description: z.string().max(5000).nullable().optional()
    .openapi({ example: 'Channel discussing interesting topics.', description: 'A description for the YouTube channel.' }),
  custom_url: z.string().max(255).nullable().optional()
    .openapi({ example: '@MyAwesomeChannel', description: 'The custom URL handle of the YouTube channel.' }),
  thumbnail_url: z.string().url().max(2048).nullable().optional()
    .openapi({ example: 'https://yt3.ggpht.com/...', description: 'URL of the channel\'s default thumbnail.' }),
  default_language: z.string().max(10).nullable().optional() // e.g., en, en-US
    .openapi({ example: 'en-US', description: 'Default language for videos uploaded to this channel.' }),
  default_category_id_on_youtube: z.string().max(50).nullable().optional() // YouTube's category ID (e.g., '22' for People & Blogs)
    .openapi({ example: '22', description: 'Default YouTube category ID for videos.' }),
  prompt_template_for_title: z.string().max(2000).nullable().optional()
    .openapi({ example: 'New Video: {topic} - Episode {ep_number}', description: 'Template for generating video titles.' }),
  prompt_template_for_description: z.string().max(10000).nullable().optional()
    .openapi({ example: 'In this episode, we discuss {topic_details}.\n\nKeywords: {keywords}', description: 'Template for generating video descriptions.' }),
  prompt_template_for_tags: z.string().max(1000).nullable().optional()
    .openapi({ example: '{topic}, {guest_name}, podcast, new episode', description: 'Template for generating video tags.' }),
  prompt_template_for_first_comment: z.string().max(2000).nullable().optional()
    .openapi({ example: 'Join the discussion! What are your thoughts on {topic}?', description: 'Template for the first comment on videos.' }),
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

// Schema for query parameters when listing YouTube channels
export const ListYouTubeChannelsQuerySchema = z.object({
  category_id: z.string().optional() // Keep as string for query param
    .transform(val => val ? parseInt(val, 10) : undefined)
    .pipe(z.number().int().positive().optional())
    .openapi({ description: 'Filter by category ID.', example: '1' }),
}).openapi('ListYouTubeChannelsQuery');

// Schema for listing YouTube channels
export const ListYouTubeChannelsResponseSchema = SimpleListResponseSchema(YouTubeChannelSchema, 'channels')
  .openapi('ListYouTubeChannelsResponse');

// Schema for getting a single YouTube channel
export const GetYouTubeChannelResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
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
