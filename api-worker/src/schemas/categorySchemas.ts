// src/schemas/categorySchemas.ts
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

const CategoryBaseSchema = z.object({
  name: z.string().max(255).openapi({ example: 'Technology Updates' }),
  slug: z.string().max(255).optional().openapi({ example: 'technology-updates', description: 'The URL-friendly slug for the category. Auto-generated if not provided.' }),
  description: z.string().max(5000).openapi({ example: 'Latest news and discussions in the tech world.' }),
  default_source_background_bucket_key: z.string().openapi({ example: 'defaults/tech_video_bg.mp4' }), // For general/video background
  default_source_thumbnail_bucket_key: z.string().openapi({ example: 'defaults/tech_video_thumb.png' }), // For general/video thumbnail

  // New fields from migration (TEXT NOT NULL DEFAULT '')
  first_comment_template: z.string().openapi({ example: 'Check out our latest episode on {topic}!' }),
  show_title: z.string().openapi({ example: 'Tech Unfiltered' }),
  custom_url: z.string().openapi({ example: 'tech-unfiltered-podcast' }),
  default_source_background_music_bucket_key: z.string().openapi({ example: 'defaults/music_bg.mp3' }),
  default_source_intro_music_bucket_key: z.string().openapi({ example: 'defaults/music_intro.mp3' }),

  // Prompt templates (existing, unchanged by this migration)
  prompt_template_to_gen_evergreen_titles: z.string().openapi({ example: 'Generate an evergreen title about {topic} in technology.' }),
  prompt_template_to_gen_news_titles: z.string().openapi({ example: 'Create a news title for a recent event: {event_summary}.' }),
  prompt_template_to_gen_series_titles: z.string().openapi({ example: 'Suggest a series title for a podcast about {series_theme} in tech.' }),
  prompt_template_to_gen_article_content: z.string().openapi({ example: 'Write an article about {topic} focusing on {aspect}.' }),
  prompt_template_to_gen_audio_podcast: z.string().openapi({ example: 'Draft a script segment for an audio podcast discussing {segment_topic}.' }), // Assuming this column still exists in DB

  // Renamed prompt templates
  prompt_template_to_gen_article_metadata: z.string().openapi({ example: 'Generate detailed article metadata for an episode about {episode_topic}.' }), // was prompt_template_to_gen_description
  prompt_template_to_gen_podcast_script: z.string().openapi({ example: 'Create a podcast script for an episode on {episode_topic}.' }),      // was prompt_template_to_gen_short_description
  prompt_template_to_gen_video_bg: z.string().openapi({ example: 'Describe a video background for a podcast about {episode_topic}.' }),        // was prompt_template_to_gen_tag_list
  prompt_template_to_gen_bg_music: z.string().openapi({ example: 'Suggest background music for a video about {video_topic}.' }),           // was prompt_template_to_gen_video_thumbnail
  prompt_template_to_gen_intro_music: z.string().openapi({ example: 'Suggest intro music for an article on {article_topic}.' }),         // was prompt_template_to_gen_article_image

  language_code: z.string().length(2).openapi({ example: 'en' }),
}).openapi('CategoryBase');

export const CategorySchema = CategoryBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1 }),
  created_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.coerce.date().openapi({ example: '2023-01-01T12:00:00Z' }),
}).openapi('Category');

export const CategoryCreateRequestSchema = CategoryBaseSchema;

export const CategoryCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Category created successfully.'),
  categoryId: z.number().int().positive().openapi({ example: 123 }),
}).openapi('CategoryCreateResponse');

export const CategorySummarySchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Technology Updates' }),
  slug: z.string().optional().openapi({ example: 'technology-updates' }),
  language_code: z.string().length(2).openapi({ example: 'en' }),
}).openapi('CategorySummary');

export const ListCategoriesResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  categories: z.array(CategorySummarySchema)
}).openapi('ListCategoriesResponse');

export const GetCategoryResponseSchema = z.object({
    success: z.boolean().openapi({ example: true }),
    category: CategorySchema
}).openapi('GetCategoryResponse');

export const CategoryUpdateRequestSchema = CategoryBaseSchema.partial().openapi('CategoryUpdateRequest');

export const CategoryUpdateResponseSchema = MessageResponseSchema.extend({
    // The 'message' field will now be inherited from MessageResponseSchema (z.string())
}).openapi('CategoryUpdateResponse');

export const CategoryDeleteResponseSchema = MessageResponseSchema.extend({
    message: z.literal("Category deleted successfully.")
}).openapi('CategoryDeleteResponse');

// Specific Error Schemas for Categories
export const CategoryNameExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Category name already exists.")
}).openapi('CategoryNameExistsError');

export const CategorySlugExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Category slug already exists.")
}).openapi('CategorySlugExistsError');

export const CategoryCreateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Failed to create category.")
    // errors: z.record(z.string()).optional().openapi({ example: { name: 'Name is required' } })
}).openapi('CategoryCreateFailedError');

export const CategoryUpdateFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Failed to update category.")
}).openapi('CategoryUpdateFailedError');

export const CategoryDeleteFailedErrorSchema = GeneralBadRequestErrorSchema.extend({
    // As per spec: "Cannot delete category: It is referenced by existing podcasts or series."
    message: z.string().openapi({example: "Cannot delete category: It is referenced by existing podcasts or series."})
}).openapi('CategoryDeleteFailedError');

export const CategoryNotFoundErrorSchema = GeneralNotFoundErrorSchema.extend({
    message: z.literal("Category not found.")
}).openapi('CategoryNotFoundError');
