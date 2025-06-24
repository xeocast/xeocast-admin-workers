// src/schemas/episodeSchemas.ts
import { z } from '@hono/zod-openapi';
import {
  MessageResponseSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema
} from './common.schemas';

// Enum for episode publication type, based on database schema
export const EpisodePublicationTypeSchema = z.enum(['evergreen', 'news']).openapi({
  description: 'The publication type of the episode (e.g., evergreen content or timely news).',
  example: 'evergreen'
});

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
  title: z.string().min(1).max(255).openapi({ example: 'My First Episode' }),
  slug: z.string().max(255).optional().openapi({ example: 'my-first-episode', description: 'The URL-friendly slug for the episode. Auto-generated if not provided.' }),
  description: z.string().min(1).max(5000).openapi({ example: 'An introduction to the series.' }),
  markdownContent: z.string().min(1).openapi({ example: '# Welcome\n\nThis is the content.' }),
  tags: z.string().optional().default('[]').openapi({ example: '["tech", "astro"]', description: 'Tags for the episode, stored as a string (intended as JSON stringified array).' }),
  type: EpisodePublicationTypeSchema,
  firstComment: z.string().max(1000).optional().nullable().openapi({ example: 'Check out our website for more!' }),
  script: z.string().optional().default('[]').openapi({ example: '[{"speaker": "Host", "line": "Welcome to the show!"}]', description: 'Episode script, stored as a string (intended as JSON string).' }),
  audioBucketKey: z.string().max(255).optional().nullable().openapi({ example: 'episodes/audio/episode_audio.mp3' }),
  backgroundBucketKey: z.string().max(255).optional().nullable().openapi({ example: 'episodes/backgrounds/background_image.png' }),
  backgroundMusicBucketKey: z.string().max(255).optional().nullable().openapi({ example: 'episodes/music/bg_music.mp3' }),
  introMusicBucketKey: z.string().max(255).optional().nullable().openapi({ example: 'episodes/music/intro_music.mp3' }),
  videoBucketKey: z.string().max(255).optional().nullable().openapi({ example: 'episodes/video/final_video.mp4' }),
  thumbnailBucketKey: z.string().max(255).optional().nullable().openapi({ example: 'episodes/thumbnails/episode_thumbnail.png' }),
  articleImageBucketKey: z.string().max(255).optional().nullable().openapi({ example: 'episodes/images/article_image.png' }),
  thumbnailGenPrompt: z.string().max(2000).optional().nullable().openapi({ example: 'A vibrant image of a microphone with sound waves.' }),
  articleImageGenPrompt: z.string().max(2000).optional().nullable().openapi({ example: 'A futuristic cityscape representing technology.' }),
  scheduledPublishAt: z.union([z.string().datetime({ message: "Invalid datetime string. Must be UTC ISO 8601 format." }), z.date()]).optional().nullable().openapi({ example: '2024-12-31T23:59:59Z' }),
  statusOnYoutube: EpisodeStatusOnPlatformSchema.optional().nullable(),
  statusOnWebsite: EpisodeStatusOnPlatformSchema.optional().nullable(),
  statusOnX: EpisodeStatusOnPlatformSchema.optional().nullable(),
  freezeStatus: z.boolean().optional().default(true),
  status: EpisodeStatusSchema.default('draft'),
  showId: z.number().int().positive(),
  seriesId: z.number().int().positive().optional().nullable(),
}).openapi('EpisodeBase');

// Schema for data as it's stored in/retrieved from the database
// This is an intermediate schema, not directly used for API request/response validation usually
export const EpisodeDbSchema = EpisodeBaseSchema.extend({
  id: z.number().int().positive(),
  // Ensure all fields from DB are represented, especially those with defaults or specific types
  // slug, description, markdownContent are already in EpisodeBaseSchema and DB ensures they are NOT NULL
  // tags and script are already in EpisodeBaseSchema, DB stores them as TEXT
  freezeStatus: z.union([z.boolean(), z.number()]), // Stored as BOOLEAN (0 or 1 in SQLite), accept number before transform
  lastStatusChangeAt: z.union([z.string(), z.date()]), // Stored as DATETIME string or Date, will be transformed
  createdAt: z.union([z.string(), z.date()]), // Stored as DATETIME string or Date, will be transformed
  updatedAt: z.union([z.string(), z.date()]), // Stored as DATETIME string or Date, will be transformed
});

// This is the schema that EpisodeSchema transforms into. We define it explicitly.
const EpisodeOutputObjectSchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  showId: z.number().int().positive().openapi({ example: 1 }),
  seriesId: z.number().int().positive().optional().nullable().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'My First Episode' }),
  slug: z.string().openapi({ example: 'my-first-episode' }),
  description: z.string().openapi({ example: 'An introduction to the series.' }),
  markdownContent: z.string().openapi({ example: '# Welcome\n\nThis is the content.' }),
  tags: z.string().openapi({ example: '["tech", "astro"]' }), // Kept as string as per user request
  type: EpisodePublicationTypeSchema,
  firstComment: z.string().optional().nullable().openapi({ example: 'Check out our website for more!' }),
  script: z.string().openapi({ example: '[{"speaker": "Host", "line": "Welcome to the show!"}]' }), // Kept as string as per user request
  audioBucketKey: z.string().optional().nullable().openapi({ example: 'episodes/audio/episode_audio.mp3' }),
  backgroundBucketKey: z.string().optional().nullable().openapi({ example: 'episodes/backgrounds/background_image.png' }),
  backgroundMusicBucketKey: z.string().optional().nullable().openapi({ example: 'episodes/music/bg_music.mp3' }),
  introMusicBucketKey: z.string().optional().nullable().openapi({ example: 'episodes/music/intro_music.mp3' }),
  videoBucketKey: z.string().optional().nullable().openapi({ example: 'episodes/video/final_video.mp4' }),
  thumbnailBucketKey: z.string().optional().nullable().openapi({ example: 'episodes/thumbnails/episode_thumbnail.png' }),
  articleImageBucketKey: z.string().optional().nullable().openapi({ example: 'episodes/images/article_image.png' }),
  thumbnailGenPrompt: z.string().optional().nullable().openapi({ example: 'A vibrant image of a microphone with sound waves.' }),
  articleImageGenPrompt: z.string().optional().nullable().openapi({ example: 'A futuristic cityscape representing technology.' }),
  scheduledPublishAt: z.date().optional().nullable().openapi({ example: '2024-12-31T23:59:59Z' }),
  statusOnYoutube: EpisodeStatusOnPlatformSchema.optional().nullable(),
  statusOnWebsite: EpisodeStatusOnPlatformSchema.optional().nullable(),
  statusOnX: EpisodeStatusOnPlatformSchema.optional().nullable(),
  freezeStatus: z.boolean(),
  status: EpisodeStatusSchema,
  lastStatusChangeAt: z.date().openapi({ example: '2023-01-01T12:05:00Z' }),
  createdAt: z.date().openapi({ example: '2023-01-01T12:00:00Z' }),
  updatedAt: z.date().openapi({ example: '2023-01-01T12:10:00Z' }),
});

// Schema for API responses (transforms DB data, e.g., coerces dates)
export const EpisodeSchema = EpisodeDbSchema.transform(dbData => {
  const processDate = (dateInput: string | Date | null | undefined): Date | null => {
    if (dateInput === null || dateInput === undefined) return null;
    if (dateInput instanceof Date) return new Date(dateInput); // Return new Date instance to ensure it's a fresh object
    // Assuming string format from DB is 'YYYY-MM-DD HH:MM:SS'
    // D1 might return ISO 8601 strings like 'YYYY-MM-DDTHH:MM:SS.SSSZ' or 'YYYY-MM-DD HH:MM:SS'
    // new Date() is generally robust for ISO 8601 strings.
    // If specific cleaning like .replace(' ', 'T') + 'Z' is needed for non-standard strings:
    if (typeof dateInput === 'string' && dateInput.includes(' ') && !dateInput.includes('T')) {
      return new Date(dateInput.replace(' ', 'T') + 'Z');
    }
    return new Date(dateInput);
  };

  return {
    ...dbData,
    // Ensure all fields from EpisodeDbSchema are explicitly handled or passed through if they are part of EpisodeOutputObjectSchema
    id: dbData.id,
    showId: dbData.showId,
    seriesId: dbData.seriesId,
    title: dbData.title,
    slug: dbData.slug,
    description: dbData.description,
    markdownContent: dbData.markdownContent,
    tags: dbData.tags, // Kept as string
    type: dbData.type,
    firstComment: dbData.firstComment,
    script: dbData.script, // Kept as string
    audioBucketKey: dbData.audioBucketKey,
    backgroundBucketKey: dbData.backgroundBucketKey,
    backgroundMusicBucketKey: dbData.backgroundMusicBucketKey,
    introMusicBucketKey: dbData.introMusicBucketKey,
    videoBucketKey: dbData.videoBucketKey,
    thumbnailBucketKey: dbData.thumbnailBucketKey,
    articleImageBucketKey: dbData.articleImageBucketKey,
    thumbnailGenPrompt: dbData.thumbnailGenPrompt,
    articleImageGenPrompt: dbData.articleImageGenPrompt,
    statusOnYoutube: dbData.statusOnYoutube,
    statusOnWebsite: dbData.statusOnWebsite,
    statusOnX: dbData.statusOnX,
    status: dbData.status,
    
    // Transformed fields
    lastStatusChangeAt: processDate(dbData.lastStatusChangeAt) as Date, // Cast as Date because it's non-nullable in output
    createdAt: processDate(dbData.createdAt) as Date, // Cast as Date
    updatedAt: processDate(dbData.updatedAt) as Date, // Cast as Date
    scheduledPublishAt: processDate(dbData.scheduledPublishAt),
    freezeStatus: Boolean(dbData.freezeStatus),
  };
}).pipe(EpisodeOutputObjectSchema) // Pipe into the explicitly defined output schema
  .openapi('Episode');

export const EpisodeCreateRequestSchema = EpisodeBaseSchema;

export const EpisodeCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Episode created successfully.'),
  id: z.number().int().positive().openapi({ example: 101 }),
}).openapi('EpisodeCreateResponse');

// Schema for pagination details
const PaginationSchema = z.object({
  page: z.number().int().positive().openapi({ example: 1, description: 'Current page number.' }),
  limit: z.number().int().positive().openapi({ example: 10, description: 'Number of items per page.' }),
  totalItems: z.number().int().nonnegative().openapi({ example: 100, description: 'Total number of items available.' }),
  totalPages: z.number().int().nonnegative().openapi({ example: 10, description: 'Total number of pages.' }),
}).openapi('Pagination');

// Schema for individual items in the episode list response
export const EpisodeListItemSchema = EpisodeOutputObjectSchema.pick({
  id: true,
  title: true,
  slug: true,
  status: true,
  type: true,
  showId: true,
  seriesId: true,
  scheduledPublishAt: true,
  tags: true,
  freezeStatus: true,
  updatedAt: true,
  createdAt: true,
}).openapi('EpisodeListItem');

// Enum for sortable fields
export const EpisodeSortBySchema = z.enum([
  'id',
  'title',
  'status',
  'type',
  'showId',
  'seriesId',
  'scheduledPublishAt',
  'createdAt',
  'updatedAt'
]).openapi({ description: 'Field to sort episodes by.', example: 'createdAt' });

// Enum for sort order
export const SortOrderSchema = z.enum(['asc', 'desc']).openapi({ description: 'Sort order.', example: 'desc' });

export const ListEpisodesQuerySchema = z.object({
    page: z.string().optional().default('1').transform(val => parseInt(val, 10)).refine(val => val > 0, { message: 'Page must be positive' }),
    limit: z.string().optional().default('10').transform(val => parseInt(val, 10)).refine(val => val > 0, { message: 'Limit must be positive' }),
    status: EpisodeStatusSchema.optional(),
    showId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || val > 0, { message: 'Show ID must be positive' }),
    seriesId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || val > 0, { message: 'Series ID must be positive' }),
    title: z.string().optional(),
    type: EpisodePublicationTypeSchema.optional(),
    sortBy: EpisodeSortBySchema.optional().default('createdAt'),
    sortOrder: SortOrderSchema.optional().default('desc'),
  });

export const ListEpisodesResponseSchema = z.object({
  episodes: z.array(EpisodeListItemSchema),
  pagination: PaginationSchema
}).openapi('ListEpisodesResponse');

export const GetEpisodeResponseSchema = z.object({
  episode: EpisodeSchema
}).openapi('GetEpisodeResponse');

export const EpisodeUpdateRequestSchema = EpisodeBaseSchema.partial().openapi('EpisodeUpdateRequest');

export const EpisodeUpdateResponseSchema = MessageResponseSchema.extend({
    message: z.string().openapi({example: 'Episode updated successfully.'})
}).openapi('EpisodeUpdateResponse');

export const EpisodeDeleteResponseSchema = MessageResponseSchema.extend({
    message: z.literal("Episode deleted successfully.")
}).openapi('EpisodeDeleteResponse');

export const EpisodeCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.string().openapi({ example: "Failed to create episode." }),
}).openapi('EpisodeCreateFailedError');

export const EpisodeSlugExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
  message: z.literal("Episode slug already exists for this show/series combination.")
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
