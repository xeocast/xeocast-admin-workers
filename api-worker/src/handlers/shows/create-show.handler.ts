import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  ShowCreateRequestSchema,
  ShowNameExistsErrorSchema,
  ShowSlugExistsErrorSchema,
  ShowCreateFailedErrorSchema,
  ShowCreateResponseSchema
} from '../../schemas/show.schemas';
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

export const createShowHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(ShowCreateFailedErrorSchema.parse({
            message: 'Invalid JSON payload.'
    }), 400);
  }

  const validationResult = ShowCreateRequestSchema.safeParse(requestBody);

  if (!validationResult.success) {
    console.error('Create show validation error:', validationResult.error.flatten());
    return c.json(ShowCreateFailedErrorSchema.parse({
            message: 'Invalid input for creating show.',
      // errors: validationResult.error.flatten().fieldErrors // Optional: include detailed field errors
    }), 400);
  }

  const showData = validationResult.data;
  let slug = showData.slug;

  if (!slug || slug.startsWith('temp-slug-')) {
    const newSlug = generateSlug(showData.name);
    slug = newSlug || `show-${Date.now()}`; // Fallback if name results in an empty slug
  }

  try {
    // Ensure the slug is unique
    slug = await ensureUniqueSlug(c.env.DB, slug, 'shows');
    // Check if show name already exists
    const existingShowByName = await c.env.DB.prepare(
      'SELECT id FROM shows WHERE name = ?1'
    ).bind(showData.name).first<{ id: number }>();

    if (existingShowByName) {
      return c.json(ShowNameExistsErrorSchema.parse({
                message: 'Show name already exists.'
      }), 400);
    }

    // Insert new show
    const stmt = c.env.DB.prepare(
      `INSERT INTO shows (
        name, slug, description, slogan, custom_url,
        default_episode_background_bucket_key, default_episode_thumbnail_bucket_key,
        default_episode_background_music_bucket_key, default_episode_intro_music_bucket_key,
        first_comment_template,
        prompt_template_to_gen_evergreen_titles, prompt_template_to_gen_news_titles,
        prompt_template_to_gen_series_titles, prompt_template_to_gen_article_content,
        prompt_template_to_gen_article_metadata, prompt_template_to_gen_episode_script,
        prompt_template_to_gen_episode_background, prompt_template_to_gen_episode_audio,
        prompt_template_to_gen_episode_background_music, prompt_template_to_gen_episode_intro_music,
        config, language_code
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22)`
    ).bind(
      showData.name,                                  // 1
      slug,                                           // 2 (potentially modified)
      showData.description,                           // 3
      showData.slogan,                                // 4
      showData.custom_url,                            // 5
      showData.default_episode_background_bucket_key, // 6
      showData.default_episode_thumbnail_bucket_key,  // 7
      showData.default_episode_background_music_bucket_key, // 8
      showData.default_episode_intro_music_bucket_key,    // 9
      showData.first_comment_template,                // 10
      showData.prompt_template_to_gen_evergreen_titles, // 11
      showData.prompt_template_to_gen_news_titles,    // 12
      showData.prompt_template_to_gen_series_titles,  // 13
      showData.prompt_template_to_gen_article_content,// 14
      showData.prompt_template_to_gen_article_metadata, // 15
      showData.prompt_template_to_gen_episode_script, // 16
      showData.prompt_template_to_gen_episode_background, // 17
      showData.prompt_template_to_gen_episode_audio,  // 18
      showData.prompt_template_to_gen_episode_background_music, // 19
      showData.prompt_template_to_gen_episode_intro_music,    // 20
      showData.config,                                // 21
      showData.language_code                          // 22
    );
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(ShowCreateResponseSchema.parse({
        
        message: 'Show created successfully.',
        id: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert show, D1 result:', result);
      return c.json(ShowCreateFailedErrorSchema.parse({
                message: 'Failed to create show.'
      }), 500);
    }

  } catch (error) {
    console.error('Error creating show:', error);
    // Check for specific D1 errors if possible, e.g., unique constraint violation if not caught above
    // For now, a general server error
    return c.json(ShowCreateFailedErrorSchema.parse({
                message: 'Failed to create show.'
    }), 500);
  }
};
