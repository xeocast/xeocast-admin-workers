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
  description: z.string().max(5000).openapi({ example: 'Latest news and discussions in the tech world.' }),
  default_source_background_bucket_key: z.string().openapi({ example: 'defaults/tech_bg.mp3' }),
  default_source_thumbnail_bucket_key: z.string().openapi({ example: 'defaults/tech_thumb.png' }),
  prompt_template_to_gen_evergreen_titles: z.string().openapi({ example: 'Generate an evergreen title about {topic} in technology.' }),
  prompt_template_to_gen_news_titles: z.string().openapi({ example: 'Create a news title for a recent event: {event_summary}.' }),
  prompt_template_to_gen_series_titles: z.string().openapi({ example: 'Suggest a series title for a podcast about {series_theme} in tech.' }),
  prompt_template_to_gen_article_content: z.string().openapi({ example: 'Write an article about {topic} focusing on {aspect}.' }),
  prompt_template_to_gen_description: z.string().openapi({ example: 'Generate a detailed podcast description for an episode about {episode_topic}.' }),
  prompt_template_to_gen_short_description: z.string().openapi({ example: 'Create a short, catchy description for a podcast on {episode_topic}.' }),
  prompt_template_to_gen_tag_list: z.string().openapi({ example: 'List relevant tags for a podcast about {episode_topic}.' }),
  prompt_template_to_gen_audio_podcast: z.string().openapi({ example: 'Draft a script segment for an audio podcast discussing {segment_topic}.' }),
  prompt_template_to_gen_video_thumbnail: z.string().openapi({ example: 'Describe a compelling thumbnail for a video about {video_topic}.' }),
  prompt_template_to_gen_article_image: z.string().openapi({ example: 'Suggest an image concept for an article on {article_topic}.' }),
  language_code: z.string().length(2).openapi({ example: 'en' }),
}).openapi('CategoryBase');

export const CategorySchema = CategoryBaseSchema.extend({
  id: z.number().int().positive().openapi({ example: 1 }),
  created_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z' }),
  updated_at: z.string().datetime().openapi({ example: '2023-01-01T12:00:00Z' }),
}).openapi('Category');
// Removed extra }); here

export const CategoryCreateRequestSchema = CategoryBaseSchema;

export const CategoryCreateResponseSchema = MessageResponseSchema.extend({
  message: z.literal('Category created successfully.'),
  categoryId: z.number().int().positive().openapi({ example: 123 }),
}).openapi('CategoryCreateResponse');

export const CategorySummarySchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Technology Updates' }),
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
    message: z.literal("Category updated successfully.")
}).openapi('CategoryUpdateResponse');

export const CategoryDeleteResponseSchema = MessageResponseSchema.extend({
    message: z.literal("Category deleted successfully.")
}).openapi('CategoryDeleteResponse');

// Specific Error Schemas for Categories
export const CategoryNameExistsErrorSchema = GeneralBadRequestErrorSchema.extend({
    message: z.literal("Category name already exists.")
}).openapi('CategoryNameExistsError');

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
