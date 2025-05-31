import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  ShowSchema,
  GetShowResponseSchema,
  ShowNotFoundErrorSchema
} from '../../schemas/showSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';
import { z } from 'zod';

export const getShowByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({
        success: false,
        message: 'Invalid ID format.'
    }), 400);
  }

  const id = parseInt(paramValidation.data.id, 10);

  try {
    const showRaw = await c.env.DB.prepare(
      `SELECT 
        id, name, slug, description, slogan, custom_url,
        default_episode_background_bucket_key, default_episode_thumbnail_bucket_key,
        default_episode_background_music_bucket_key, default_episode_intro_music_bucket_key,
        first_comment_template,
        prompt_template_to_gen_evergreen_titles, prompt_template_to_gen_news_titles,
        prompt_template_to_gen_series_titles, prompt_template_to_gen_article_content,
        prompt_template_to_gen_article_metadata, prompt_template_to_gen_episode_script,
        prompt_template_to_gen_episode_background, prompt_template_to_gen_episode_audio,
        prompt_template_to_gen_episode_background_music, prompt_template_to_gen_episode_intro_music,
        config, language_code,
        created_at, updated_at
      FROM shows WHERE id = ?1`
    ).bind(id).first<z.infer<typeof ShowSchema>>();

    if (!showRaw) {
      return c.json(ShowNotFoundErrorSchema.parse({
        success: false,
        message: 'Show not found.'
      }), 404);
    }
    
    const show = ShowSchema.parse(showRaw);

    return c.json(GetShowResponseSchema.parse({
      success: true,
      show: show
    }), 200);

  } catch (error) {
    if (error instanceof z.ZodError) {
        console.error('Get show by ID validation error:', error.flatten());
        return c.json(GeneralServerErrorSchema.parse({
            success: false,
            message: 'Response validation failed for show data.'
        }), 500);
    }
    console.error('Error fetching show by ID:', error);
    return c.json(GeneralServerErrorSchema.parse({
        success: false,
        message: 'Failed to retrieve show.'
    }), 500);
  }
};
