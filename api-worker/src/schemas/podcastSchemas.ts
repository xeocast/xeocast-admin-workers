// src/schemas/podcastSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  PathIdParamSchema,
  SimpleListResponseSchema,
  GeneralBadRequestErrorSchema, 
  GeneralNotFoundErrorSchema, 
  GeneralServerErrorSchema 
} from './commonSchemas';

// Enum for podcast status, based on typical lifecycle
export const PodcastMediaFormatSchema = z.enum(['audio', 'video', 'audiovisual']).openapi({ description: 'The media format of the podcast (audio, video, or both).', example: 'audio' });

// Enum for podcast publication type, based on database schema
export const PodcastPublicationTypeSchema = z.enum(['evergreen', 'news']).openapi({ description: 'The publication type of the podcast (e.g., evergreen content or timely news).', example: 'evergreen' });

export const PodcastStatusSchema = z.enum([
  'draft', 'draftApproved', 'researching', 'researched', 'generatingThumbnail', 'thumbnailGenerated', 'generatingAudio', 'audioGenerated', 'generating', 'generated', 'generatedApproved', 'uploading', 'uploaded', 'published', 'unpublished'
]).openapi({description: 'The current status of the podcast.', example: 'draft'});

const PodcastBaseSchema = z.object({
  title: z.string().max(255).openapi({ example: 'My First Podcast Episode' }),
  description: z.string().max(5000).optional().openapi({ example: 'An introduction to the series.' }), 
  markdown_content: z.string().optional().openapi({ example: '# Welcome\n\nThis is the content.' }), 
  category_id: z.number().int().positive().openapi({ example: 1 }),
  series_id: z.number().int().positive().optional().nullable().openapi({ example: 1 }), 
  status: PodcastStatusSchema.default('draft').optional().openapi({ example: 'draft' }), 
  scheduled_publish_at: z.string().datetime({ message: "Invalid datetime string. Must be UTC ISO 8601 format." }).optional().nullable().openapi({ example: '2024-12-31T23:59:59Z' }), 
}).openapi('PodcastBase');

export const PodcastSchema = PodcastBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1 }),
  slug: z.string().optional().nullable().openapi({ example: 'my-first-podcast-episode' }),
  audio_bucket_key: z.string().optional().nullable().openapi({ example: 'podcasts/audio/1.mp3' }),
  video_bucket_key: z.string().optional().nullable().openapi({ example: 'podcasts/video/1.mp4' }),
  thumbnail_bucket_key: z.string().optional().nullable().openapi({ example: 'podcasts/thumbnails/1.png' }),
  duration_seconds: z.number().int().optional().nullable().openapi({ example: 3600 }),
  youtube_video_id: z.string().optional().nullable().openapi({ example: 'dQw4w9WgXcQ' }),
  youtube_playlist_id: z.string().optional().nullable().openapi({ example: 'PL...'} ),
  created_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
  published_at: z.string().datetime().optional().nullable().openapi({ example: '2023-01-02T12:00:00Z' }),
}).openapi('Podcast');

export const PodcastCreateRequestSchema = PodcastBaseSchema;

export const PodcastCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Podcast created successfully.'),
  podcastId: z.number().int().positive().openapi({ example: 101 }),
}).openapi('PodcastCreateResponse');

// Schema for pagination details
const PaginationSchema = z.object({
  page: z.number().int().positive().openapi({ example: 1, description: 'Current page number.' }),
  limit: z.number().int().positive().openapi({ example: 10, description: 'Number of items per page.' }),
  totalItems: z.number().int().nonnegative().openapi({ example: 100, description: 'Total number of items available.' }),
  totalPages: z.number().int().nonnegative().openapi({ example: 10, description: 'Total number of pages.' }),
}).openapi('Pagination');

export const ListPodcastsResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  podcasts: z.array(PodcastSchema),
  pagination: PaginationSchema
}).openapi('ListPodcastsResponse');

export const GetPodcastResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  podcast: PodcastSchema
}).openapi('GetPodcastResponse');

export const PodcastUpdateRequestSchema = PodcastBaseSchema.partial().openapi('PodcastUpdateRequest');

export const PodcastUpdateResponseSchema = MessageResponseSchema.extend({
    message: z.literal("Podcast updated successfully.")
}).openapi('PodcastUpdateResponse');

export const PodcastDeleteResponseSchema = MessageResponseSchema.extend({
    message: z.literal("Podcast deleted successfully.")
}).openapi('PodcastDeleteResponse');

export const PodcastCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Failed to create podcast."),
    // errors: z.record(z.string()).optional().openapi({ example: { category_id: 'Invalid category ID' } })
}).openapi('PodcastCreateFailedError');

export const PodcastUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.string().openapi({ example: "Failed to update podcast." })
}).openapi('PodcastUpdateFailedError');

export const PodcastNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
    message: z.literal("Podcast not found.")
}).openapi('PodcastNotFoundError');

export const PodcastDeleteFailedErrorSchema = GeneralServerErrorSchema.extend({
    message: z.string().openapi({ example: "Failed to delete podcast." })
}).openapi('PodcastDeleteFailedError');
