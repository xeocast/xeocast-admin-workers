import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  CategoryCreateRequestSchema,
  CategoryNameExistsErrorSchema,
  CategorySlugExistsErrorSchema,
  CategoryCreateFailedErrorSchema,
  CategoryCreateResponseSchema
} from '../../schemas/categorySchemas';
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

export const createCategoryHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(CategoryCreateFailedErrorSchema.parse({
      success: false,
      message: 'Invalid JSON payload.'
    }), 400);
  }

  const validationResult = CategoryCreateRequestSchema.safeParse(requestBody);

  if (!validationResult.success) {
    console.error('Create category validation error:', validationResult.error.flatten());
    return c.json(CategoryCreateFailedErrorSchema.parse({
      success: false,
      message: 'Invalid input for creating category.',
      // errors: validationResult.error.flatten().fieldErrors // Optional: include detailed field errors
    }), 400);
  }

  const categoryData = validationResult.data;
  let slug = categoryData.slug;

  if (!slug || slug.startsWith('temp-slug-')) {
    const newSlug = generateSlug(categoryData.name);
    slug = newSlug || `category-${Date.now()}`; // Fallback if name results in an empty slug
  }

  try {
    // Ensure the slug is unique
    slug = await ensureUniqueSlug(c.env.DB, slug, 'categories');
    // Check if category name already exists
    const existingCategoryByName = await c.env.DB.prepare(
      'SELECT id FROM categories WHERE name = ?1'
    ).bind(categoryData.name).first<{ id: number }>();

    if (existingCategoryByName) {
      return c.json(CategoryNameExistsErrorSchema.parse({
        success: false,
        message: 'Category name already exists.'
      }), 400);
    }

    // Insert new category
    const stmt = c.env.DB.prepare(
      `INSERT INTO categories (
        name, slug, description, 
        default_source_background_bucket_key, default_source_thumbnail_bucket_key, -- existing general/video ones
        first_comment_template, show_title, custom_url, -- new text fields
        default_source_background_music_bucket_key, default_source_intro_music_bucket_key, -- new music bucket keys
        prompt_template_to_gen_evergreen_titles, prompt_template_to_gen_news_titles,
        prompt_template_to_gen_series_titles, prompt_template_to_gen_article_content,
        prompt_template_to_gen_audio_podcast, -- existing
        prompt_template_to_gen_article_metadata, -- renamed from prompt_template_to_gen_description
        prompt_template_to_gen_podcast_script, -- renamed from prompt_template_to_gen_short_description
        prompt_template_to_gen_video_bg, -- renamed from prompt_template_to_gen_tag_list
        prompt_template_to_gen_bg_music, -- renamed from prompt_template_to_gen_video_thumbnail
        prompt_template_to_gen_intro_music, -- renamed from prompt_template_to_gen_article_image
        language_code
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21)`
    ).bind(
      categoryData.name, //1
      slug, // Use the potentially modified slug //2
      categoryData.description, //3
      categoryData.default_source_background_bucket_key, //4 (general/video)
      categoryData.default_source_thumbnail_bucket_key, //5 (general/video)
      categoryData.first_comment_template, //6 (new)
      categoryData.show_title, //7 (new)
      categoryData.custom_url, //8 (new)
      categoryData.default_source_background_music_bucket_key, //9 (new music)
      categoryData.default_source_intro_music_bucket_key, //10 (new music)
      categoryData.prompt_template_to_gen_evergreen_titles, //11
      categoryData.prompt_template_to_gen_news_titles, //12
      categoryData.prompt_template_to_gen_series_titles, //13
      categoryData.prompt_template_to_gen_article_content, //14
      categoryData.prompt_template_to_gen_audio_podcast, //15
      categoryData.prompt_template_to_gen_article_metadata, //16 (renamed)
      categoryData.prompt_template_to_gen_podcast_script, //17 (renamed)
      categoryData.prompt_template_to_gen_video_bg, //18 (renamed)
      categoryData.prompt_template_to_gen_bg_music, //19 (renamed)
      categoryData.prompt_template_to_gen_intro_music, //20 (renamed)
      categoryData.language_code //21
    );
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(CategoryCreateResponseSchema.parse({
        success: true,
        message: 'Category created successfully.',
        categoryId: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert category, D1 result:', result);
      return c.json(CategoryCreateFailedErrorSchema.parse({
        success: false,
        message: 'Failed to create category.'
      }), 500);
    }

  } catch (error) {
    console.error('Error creating category:', error);
    // Check for specific D1 errors if possible, e.g., unique constraint violation if not caught above
    // For now, a general server error
    return c.json(CategoryCreateFailedErrorSchema.parse({
        success: false,
        message: 'Failed to create category.'
    }), 500);
  }
};
