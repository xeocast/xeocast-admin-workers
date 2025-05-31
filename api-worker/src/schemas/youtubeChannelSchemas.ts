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
  show_id: z.number().int().positive()
    .openapi({ example: 1, description: 'The ID of the show this YouTube channel is associated with.' }),
  youtube_platform_id: z.string().min(1).max(100)
    .openapi({ example: 'UCxxxxxxxxxxxxxxxxx', description: 'The unique YouTube Channel ID (platform ID).' }),
  title: z.string().min(1).max(255) // Renamed from name
    .openapi({ example: 'My Awesome Channel', description: 'The title (name) of the YouTube channel.' }),
  description: z.string().max(5000) // Now required, was nullable().optional()
    .openapi({ example: 'Channel discussing interesting topics.', description: 'A description for the YouTube channel.' }),
  custom_url: z.string().max(255).nullable().optional()
    .openapi({ example: '@MyAwesomeChannel', description: 'The custom URL handle of the YouTube channel.' }),
  thumbnail_url: z.string().url().max(2048).nullable().optional()
    .openapi({ example: 'https://yt3.ggpht.com/...', description: 'URL of the channel\'s default thumbnail.' }),
  country: z.string().length(2).nullable().optional() // Added field, ISO 3166-1 alpha-2 code
    .openapi({ example: 'US', description: 'Country affiliation of the channel (ISO 3166-1 alpha-2 code).' }),
  language_code: z.string().min(2).max(10) // Renamed from default_language, now required
    .openapi({ example: 'en-US', description: 'Default language for videos (e.g., en, en-US).' }),
  youtube_playlist_id_for_uploads: z.string().min(1).max(100).nullable().optional() // Added field
    .openapi({ example: 'UUxxxxxxxxxxxxxxxxx', description: 'Playlist ID for all uploads from this channel.' }),
  youtube_platform_category_id: z.string().max(50) // Renamed from default_show_id_on_youtube, now required
    .openapi({ example: '22', description: 'Default YouTube category ID for videos (e.g., People & Blogs is 22).' }),
  video_title_template: z.string().max(2000).nullable().optional() // Renamed from prompt_template_for_title
    .openapi({ example: 'New Video: {topic} - Episode {ep_number}', description: 'Template for generating video titles.' }),
  video_description_template: z.string().max(10000) // Renamed from prompt_template_for_description, now required
    .openapi({ example: 'In this episode, we discuss {topic_details}.\n\nKeywords: {keywords}', description: 'Template for generating video descriptions.' }),
  video_tags_template: z.string().max(1000).nullable().optional() // Renamed from prompt_template_for_tags
    .openapi({ example: '{topic}, {guest_name}, episode, new episode', description: 'Template for generating video tags.' }),
  first_comment_template: z.string().max(2000) // Renamed from prompt_template_for_first_comment, now required
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
  show_id: z.string().optional() // Keep as string for query param
    .transform(val => val ? parseInt(val, 10) : undefined)
    .pipe(z.number().int().positive().optional())
    .openapi({ description: 'Filter by show ID.', example: '1' }),
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
