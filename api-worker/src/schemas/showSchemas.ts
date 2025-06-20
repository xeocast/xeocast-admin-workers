// src/schemas/showSchemas.ts
import { z } from '@hono/zod-openapi';
import { 
    MessageResponseSchema, 
    PathIdParamSchema, 
    SimpleListResponseSchema, 
    ErrorSchema, // Added ErrorSchema for base error types
    GeneralBadRequestErrorSchema, 
    GeneralNotFoundErrorSchema, 
    GeneralServerErrorSchema 
} from './commonSchemas';

const ShowBaseSchema = z.object({
  name: z.string().max(255).openapi({ example: 'Technology Updates' }),
  slug: z.string().max(255).optional().openapi({ example: 'technology-updates', description: 'The URL-friendly slug for the show. Auto-generated if not provided.' }),
  description: z.string().max(5000).openapi({ example: 'Latest news and discussions in the tech world.' }),
  slogan: z.string().max(500).openapi({ example: 'Your daily dose of tech insights.' }),
  custom_url: z.string().max(255).openapi({ example: 'tech-unfiltered-show' }),
  default_episode_background_bucket_key: z.string().openapi({ example: 'defaults/show_episode_bg.mp4' }),
  default_episode_thumbnail_bucket_key: z.string().openapi({ example: 'defaults/show_episode_thumb.png' }),
  default_episode_background_music_bucket_key: z.string().openapi({ example: 'defaults/show_music_bg.mp3' }),
  default_episode_intro_music_bucket_key: z.string().openapi({ example: 'defaults/show_music_intro.mp3' }),
  first_comment_template: z.string().openapi({ example: 'Check out our latest show episode on {topic}!' }),
  prompt_template_to_gen_evergreen_titles: z.string().openapi({ example: 'Generate an evergreen title about {topic} for this show.' }),
  prompt_template_to_gen_news_titles: z.string().openapi({ example: 'Create a news title for a recent event: {event_summary} for this show.' }),
  prompt_template_to_gen_series_titles: z.string().openapi({ example: 'Suggest a series title for an episode about {series_theme} in this show.' }),
  prompt_template_to_gen_article_content: z.string().openapi({ example: 'Write an article about {topic} focusing on {aspect} for this show.' }),
  prompt_template_to_gen_article_metadata: z.string().openapi({ example: 'Generate detailed article metadata for an episode about {episode_topic} for this show.' }),
  prompt_template_to_gen_episode_script: z.string().openapi({ example: 'Create an episode script for an episode on {episode_topic} for this show.' }),
  prompt_template_to_gen_episode_background: z.string().openapi({ example: 'Describe an episode background for an episode about {episode_topic} for this show.' }),
  prompt_template_to_gen_episode_audio: z.string().openapi({ example: 'Draft a script segment for an audio episode discussing {segment_topic} for this show.' }),
  prompt_template_to_gen_episode_background_music: z.string().openapi({ example: 'Suggest background music for an episode about {episode_topic} for this show.' }),
  prompt_template_to_gen_episode_intro_music: z.string().openapi({ example: 'Suggest intro music for an episode on {episode_topic} for this show.' }),
  config: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    { message: 'Config must be a valid JSON string.' }
  ).openapi({ example: '{"audioGenerator": "gemini", "audioGeneratorConfig": {"model": "gemini-2.5-flash-preview-tts", "temperature": 0.7}}' }),
  language_code: z.string().length(2).openapi({ example: 'en' }),
}).openapi('ShowBase');

export const ShowSchema = ShowBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1 }),
  created_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
}).openapi('Show');

export const ShowCreateRequestSchema = ShowBaseSchema;

export const ShowCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Show created successfully.'),
  showId: z.number().int().positive().openapi({ example: 123 }),
}).openapi('ShowCreateResponse');

export const ShowSummarySchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Technology Updates' }),
  slug: z.string().optional().openapi({ example: 'technology-updates' }),
  language_code: z.string().length(2).openapi({ example: 'en' }),
}).openapi('ShowSummary');

// Enum for sortable fields for Shows
export const ShowSortBySchema = z.enum([
  'id',
  'name',
  'language_code',
  'created_at',
  'updated_at'
]).openapi({ description: 'Field to sort shows by.', example: 'name' });

// Enum for sort order (can be moved to commonSchemas if used across more modules)
export const SortOrderSchema = z.enum(['asc', 'desc']).openapi({ description: 'Sort order.', example: 'asc' });

// Schema for query parameters when listing shows
export const ListShowsQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().positive().openapi({
    example: 1,
    description: 'Page number for pagination, defaults to 1.'
  })),
  limit: z.string().optional().default('10').transform(Number).pipe(z.number().int().positive().openapi({
    example: 10,
    description: 'Number of items per page, defaults to 10.'
  })),
  name: z.string().optional().openapi({
    example: 'Tech',
    description: 'Filter by show name (case-insensitive, partial match).'
  }),
  language_code: z.string().length(2).optional().openapi({
    example: 'en',
    description: 'Filter by show language code.'
  }),
  sortBy: ShowSortBySchema.optional().default('name')
    .openapi({ description: 'Field to sort shows by.', example: 'name' }),
  sortOrder: SortOrderSchema.optional().default('asc')
    .openapi({ description: 'Sort order (asc/desc).', example: 'asc' })
}).openapi('ListShowsQuery');

export const ListShowsResponseSchema = z.object({
  shows: z.array(ShowSummarySchema),
  total: z.number().int().openapi({ example: 100, description: 'Total number of shows matching the query.' }),
  page: z.number().int().openapi({ example: 1, description: 'Current page number.' }),
  limit: z.number().int().openapi({ example: 10, description: 'Number of items per page.' }),
  totalPages: z.number().int().openapi({ example: 10, description: 'Total number of pages.' })
}).openapi('ListShowsResponse');

export const GetShowResponseSchema = z.object({
      show: ShowSchema
}).openapi('GetShowResponse');

export const ShowUpdateRequestSchema = ShowBaseSchema.partial().openapi('ShowUpdateRequest');

export const ShowUpdateResponseSchema = MessageResponseSchema.extend({
    // The 'message' field will now be inherited from MessageResponseSchema (z.string())
}).openapi('ShowUpdateResponse');

export const ShowDeleteResponseSchema = MessageResponseSchema.extend({
    message: z.literal("Show deleted successfully.")
}).openapi('ShowDeleteResponse');

// Specific Error Schemas for Shows
export const ShowNameExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Show name already exists.")
}).openapi('ShowNameExistsError');

export const ShowSlugExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Show slug already exists.")
}).openapi('ShowSlugExistsError');

export const ShowCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Failed to create show.")
    // errors: z.record(z.string()).optional().openapi({ example: { name: 'Name is required' } })
}).openapi('ShowCreateFailedError');

export const ShowUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Failed to update show.")
}).openapi('ShowUpdateFailedError');

export const ShowDeleteFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    // As per spec: "Cannot delete show: It is referenced by existing episodes or series."
    message: z.string().openapi({example: "Cannot delete show: It is referenced by existing episodes or series."})
}).openapi('ShowDeleteFailedError');

export const ShowNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
    message: z.literal("Show not found.")
}).openapi('ShowNotFoundError');
