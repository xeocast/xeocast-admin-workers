// src/schemas/episodeSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  PathIdParamSchema, // Keep for PathIdParamSchema usage if any handler uses it
  // SimpleListResponseSchema, // Not directly used by exported schemas here
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema
} from './commonSchemas';

// Enum for episode publication type, based on database schema
export const EpisodePublicationTypeSchema = z.enum(['evergreen', 'news']).openapi({ description: 'The publication type of the episode (e.g., evergreen content or timely news).', example: 'evergreen' });

const EpisodeStatusOnPlatformSchema = z.enum(['none', 'scheduled', 'public', 'private', 'deleted']);

export const EpisodeStatusSchema = z.enum([
  'draft',
  'researching',
  'researched',
  'generatingMaterial',
  'materialGenerated',
  'generatingVideo',
  'videoGenerated'
]).openapi({description: 'The current status of the episode.', example: 'draft'});

const EpisodeBaseSchema = z.object({
  title: z.string().max(255).openapi({ example: 'My First Episode Episode' }),
  slug: z.string().max(255).optional().openapi({ example: 'my-first-episode-episode', description: 'The URL-friendly slug for the episode. Auto-generated if not provided.' }),
  description: z.string().max(5000).openapi({ example: 'An introduction to the series.' }),
  markdown_content: z.string().openapi({ example: '# Welcome\n\nThis is the content.' }),
  tags: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.every(item => typeof item === 'string');
    } catch (e) {
      return false;
    }
  }, { message: "Tags must be a JSON string representing an array of strings." }).optional().default('[]').openapi({ example: '["tech", "astro"]', description: 'Tags for the episode, stored as a JSON stringified array.' }),
  type: EpisodePublicationTypeSchema.openapi({ example: 'evergreen' }),
  first_comment: z.string().optional().nullable().openapi({ example: 'Check out our website for more!' }),
  script: z.string().refine((val) => {
    try {
      JSON.parse(val); // Check if it's valid JSON
      return true;
    } catch (e) {
      return false;
    }
  }, { message: "Script must be a valid JSON string."}).optional().default('[]').openapi({ example: '[{"speaker": "Host", "line": "Welcome to the show!"}]', description: 'Episode script, stored as a JSON string. Should be a valid JSON array of objects or any valid JSON structure.' }),
  audio_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/audio/episode_audio.mp3' }),
  background_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/backgrounds/background_image.png' }),
  background_music_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/music/bg_music.mp3' }),
  intro_music_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/music/intro_music.mp3' }),
  video_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/video/final_video.mp4' }),
  thumbnail_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/thumbnails/episode_thumbnail.png' }),
  article_image_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/images/article_image.png' }), // New field
  thumbnail_gen_prompt: z.string().optional().nullable().openapi({ example: 'A vibrant image of a microphone with sound waves.' }),
  article_image_gen_prompt: z.string().optional().nullable().openapi({ example: 'A futuristic cityscape representing technology.' }),
  scheduled_publish_at: z.string().datetime({ message: "Invalid datetime string. Must be UTC ISO 8601 format." }).optional().nullable().openapi({ example: '2024-12-31T23:59:59Z' }),
  status_on_youtube: z.enum(['none', 'scheduled', 'public', 'private', 'deleted']).optional().nullable().openapi({ example: 'none' }),
  status_on_website: z.enum(['none', 'scheduled', 'public', 'private', 'deleted']).optional().nullable().openapi({ example: 'none' }),
  status_on_x: z.enum(['none', 'scheduled', 'public', 'private', 'deleted']).optional().nullable().openapi({ example: 'none' }),
  freezeStatus: z.boolean().optional().default(true).openapi({ example: true }),
  status: EpisodeStatusSchema.default('draft').openapi({ example: 'draft' }),
  show_id: z.number().int().positive().openapi({ example: 1 }),
  series_id: z.number().int().positive().optional().nullable().openapi({ example: 1 }),
}).openapi('EpisodeBase');

// Base schema for data as it's stored in/retrieved from the database
// This is an intermediate schema, not directly used for API request/response validation usually
const EpisodeDbSchema = EpisodeBaseSchema.extend({
  id: z.number().int().positive(),
  // Ensure all fields from DB are represented, especially those with defaults or specific types
  // slug: z.string(), // Already in EpisodeBaseSchema, but DB ensures it's NOT NULL
  // description: z.string(), // Already in EpisodeBaseSchema, DB ensures it's NOT NULL
  // markdown_content: z.string(), // Already in EpisodeBaseSchema, DB ensures it's NOT NULL
  tags: z.string(), // Stored as JSON string in DB
  script: z.string(), // Stored as JSON string in DB
  freezeStatus: z.union([z.boolean(), z.number()]), // Stored as BOOLEAN (0 or 1 in SQLite), accept number before transform
  last_status_change_at: z.string(), // Stored as DATETIME string, will be transformed
  created_at: z.string(), // Stored as DATETIME string, will be transformed
  updated_at: z.string(), // Stored as DATETIME string, will be transformed
});

// This is the schema that EpisodeSchema transforms into. We define it explicitly.
const EpisodeOutputObjectSchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  show_id: z.number().int().positive().openapi({ example: 1 }),
  series_id: z.number().int().positive().optional().nullable().openapi({ example: 1 }),
  title: z.string().max(255).openapi({ example: 'My First Episode Episode' }),
  slug: z.string().max(255).openapi({ example: 'my-first-episode-episode' }),
  description: z.string().max(5000).openapi({ example: 'An introduction to the series.' }),
  markdown_content: z.string().openapi({ example: '# Welcome\n\nThis is the content.' }),
  tags: z.array(z.string()).openapi({ example: ['tech', 'astro', 'cloudflare'] }),
  type: EpisodePublicationTypeSchema.openapi({ example: 'evergreen' }),
  first_comment: z.string().optional().nullable().openapi({ example: 'Check out our website for more!' }),
  script: z.array(z.any()).openapi({ example: [{speaker: 'Host', line: 'Welcome!'}] }), // Assuming script is an array of any objects
  audio_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/audio/episode_audio.mp3' }),
  background_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/backgrounds/background_image.png' }),
  background_music_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/music/bg_music.mp3' }),
  intro_music_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/music/intro_music.mp3' }),
  video_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/video/final_video.mp4' }),
  thumbnail_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/thumbnails/episode_thumbnail.png' }),
  article_image_bucket_key: z.string().optional().nullable().openapi({ example: 'episodes/images/article_image.png' }),
  thumbnail_gen_prompt: z.string().optional().nullable().openapi({ example: 'A vibrant image of a microphone with sound waves.' }),
  article_image_gen_prompt: z.string().optional().nullable().openapi({ example: 'A futuristic cityscape representing technology.' }),
  scheduled_publish_at: z.date().optional().nullable().openapi({ example: '2024-12-31T23:59:59Z' }),
  status_on_youtube: EpisodeStatusOnPlatformSchema.optional().nullable().openapi({ example: 'none' }),
  status_on_website: EpisodeStatusOnPlatformSchema.optional().nullable().openapi({ example: 'none' }),
  status_on_x: EpisodeStatusOnPlatformSchema.optional().nullable().openapi({ example: 'none' }),
  freezeStatus: z.boolean().openapi({ example: true }),
  status: EpisodeStatusSchema.openapi({ example: 'draft' }),
  last_status_change_at: z.date().openapi({ example: '2023-01-01T12:05:00Z' }),
  created_at: z.date().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.date().openapi({ example: '2023-01-01T12:10:00Z' }),
});

// Schema for API responses (transforms DB data, e.g., parses JSON strings, coerces dates)
export const EpisodeSchema = EpisodeDbSchema.transform(dbData => ({
  ...dbData,
  // Parse JSON string fields into arrays for API response
  tags: (() => {
    const rawTags = dbData.tags || '[]'; // Default to string '[]' if null/undefined
    try {
      let parsed = JSON.parse(rawTags);
      // If the first parse results in a string, it might be double-encoded JSON
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      // Ensure it's an array of strings, otherwise default to empty array
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
      console.warn(`Tags field was not a valid array of strings after parsing: ${JSON.stringify(parsed)}. Defaulting to []. Raw: ${rawTags}`);
      return [];
    } catch (e) {
      console.error(`Error parsing tags: '${rawTags}'. Error: ${e}. Defaulting to [].`);
      return [];
    }
  })(), 
  script: JSON.parse(dbData.script || '[]'),
  // Coerce date strings from DB to Date objects for consistent handling
  // Hono/JSON response will typically serialize Date objects to ISO strings
  last_status_change_at: (() => {
    const original = dbData.last_status_change_at;
    const transformed = original.replace(' ', 'T') + 'Z';
    const dateObj = new Date(transformed);
    return dateObj;
  })(),
  created_at: (() => {
    const original = dbData.created_at;
    const transformed = original.replace(' ', 'T') + 'Z';
    const dateObj = new Date(transformed);
    return dateObj;
  })(),
  updated_at: (() => {
    const original = dbData.updated_at;
    const transformed = original.replace(' ', 'T') + 'Z';
    const dateObj = new Date(transformed);
    return dateObj;
  })(),
  scheduled_publish_at: (() => {
    if (!dbData.scheduled_publish_at) return null;
    const original = dbData.scheduled_publish_at;
    // Assuming scheduled_publish_at is already in a good format if it exists
    const dateObj = new Date(original);
    return dateObj;
  })(),
  freezeStatus: Boolean(dbData.freezeStatus),
})).pipe(EpisodeOutputObjectSchema) // Pipe into the explicitly defined output schema
  .openapi('Episode');

export const EpisodeCreateRequestSchema = EpisodeBaseSchema;

export const EpisodeCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Episode created successfully.'),
  episodeId: z.number().int().positive().openapi({ example: 101 }),
}).openapi('EpisodeCreateResponse');

// Schema for pagination details
const PaginationSchema = z.object({
  page: z.number().int().positive().openapi({ example: 1, description: 'Current page number.' }),
  limit: z.number().int().positive().openapi({ example: 10, description: 'Number of items per page.' }),
  totalItems: z.number().int().nonnegative().openapi({ example: 100, description: 'Total number of items available.' }),
  totalPages: z.number().int().nonnegative().openapi({ example: 10, description: 'Total number of pages.' }),
}).openapi('Pagination');

// Schema for individual items in the episode list response
// Now we can pick directly from EpisodeOutputObjectSchema
export const EpisodeListItemSchema = EpisodeOutputObjectSchema.pick({
  id: true,
  title: true,
  slug: true,
  status: true,
  type: true,
  show_id: true,
  series_id: true,
  scheduled_publish_at: true,
  tags: true,
  freezeStatus: true,
  updated_at: true,
  created_at: true,
}).openapi('EpisodeListItem');
export const ListEpisodesResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  episodes: z.array(EpisodeListItemSchema),
  pagination: PaginationSchema
}).openapi('ListEpisodesResponse');

export const GetEpisodeResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  episode: EpisodeSchema
}).openapi('GetEpisodeResponse');

export const EpisodeUpdateRequestSchema = EpisodeBaseSchema.partial().openapi('EpisodeUpdateRequest');

export const EpisodeUpdateResponseSchema = MessageResponseSchema.extend({
    // The 'message' field will now be inherited from MessageResponseSchema (z.string())
}).openapi('EpisodeUpdateResponse');

export const EpisodeDeleteResponseSchema = MessageResponseSchema.extend({
    message: z.literal("Episode deleted successfully.")
}).openapi('EpisodeDeleteResponse');

export const EpisodeCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Failed to create episode."),
    // errors: z.record(z.string()).optional().openapi({ example: { show_id: 'Invalid show ID' } })
}).openapi('EpisodeCreateFailedError');

export const EpisodeSlugExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.literal("Episode slug already exists in this series.")
}).openapi('EpisodeSlugExistsError');

export const EpisodeUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.string().openapi({ example: "Failed to update episode." })
}).openapi('EpisodeUpdateFailedError');

export const EpisodeNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
    message: z.literal("Episode not found.")
}).openapi('EpisodeNotFoundError');

export const EpisodeDeleteFailedErrorSchema = GeneralServerErrorSchema.extend({
    message: z.string().openapi({ example: "Failed to delete episode." })
}).openapi('EpisodeDeleteFailedError');
