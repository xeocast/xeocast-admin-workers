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
export const PodcastStatusSchema = z.enum([
  'draft', 'scheduled', 'generating_audio', 'generating_video', 'pending_approval',
  'uploading', 'published', 'archived', 'error'
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
  created_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z' }),
  published_at: z.string().datetime().optional().nullable().openapi({ example: '2023-01-02T12:00:00Z' }),
}).openapi('Podcast');

export const PodcastCreateRequestSchema = PodcastBaseSchema;

export const PodcastCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Podcast created successfully.'),
  podcastId: z.number().int().positive().openapi({ example: 101 }),
}).openapi('PodcastCreateResponse');

export const ListPodcastsResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  podcasts: z.array(PodcastSchema)
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
    message: z.literal("Failed to update podcast.")
}).openapi('PodcastUpdateFailedError');

export const PodcastNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
    message: z.literal("Podcast not found.")
}).openapi('PodcastNotFoundError');

export const PodcastDeleteFailedErrorSchema = GeneralServerErrorSchema.extend({
    message: z.literal("Failed to delete podcast.")
}).openapi('PodcastDeleteFailedError');
