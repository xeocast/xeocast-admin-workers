import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi';
import {
  YouTubeChannelSchema,
  GetYouTubeChannelResponseSchema,
  YouTubeChannelNotFoundErrorSchema
} from '../../schemas/youtubeChannelSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

// Helper to map DB row to YouTubeChannelSchema compatible object (can be shared or defined locally)
const mapDbRowToYouTubeChannel = (row: any): z.infer<typeof YouTubeChannelSchema> => {
  return YouTubeChannelSchema.parse({
    id: row.id,
    category_id: row.category_id,
    youtube_platform_id: row.youtube_platform_id,
    name: row.title, // DB 'title' -> Zod 'name'
    description: row.description,
    custom_url: row.custom_url || null, 
    thumbnail_url: row.thumbnail_url || null, 
    default_language: row.language_code, // DB 'language_code' -> Zod 'default_language'
    default_category_id_on_youtube: row.youtube_platform_category_id, // DB 'youtube_platform_category_id' -> Zod 'default_category_id_on_youtube'
    prompt_template_for_title: row.prompt_template_for_title || null, 
    prompt_template_for_description: row.video_description_template, // DB 'video_description_template' -> Zod 'prompt_template_for_description'
    prompt_template_for_tags: row.prompt_template_for_tags || null, 
    prompt_template_for_first_comment: row.first_comment_template, // DB 'first_comment_template' -> Zod 'prompt_template_for_first_comment'
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
};

export const getYouTubeChannelByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        success: false, 
        message: 'Invalid ID format in path.',
        // errors: paramsValidation.error.flatten().fieldErrors 
    }), 400);
  }

  const id = parseInt(paramsValidation.data.id, 10);

  try {
    const stmt = c.env.DB.prepare(
      'SELECT id, category_id, youtube_platform_id, title, description, language_code, youtube_platform_category_id, video_description_template, first_comment_template, created_at, updated_at FROM youtube_channels WHERE id = ?1'
    ).bind(id);
    
    const row = await stmt.first();

    if (!row) {
      return c.json(YouTubeChannelNotFoundErrorSchema.parse({ success: false, message: 'YouTube channel not found.' }), 404);
    }

    const channel = mapDbRowToYouTubeChannel(row);
    return c.json(GetYouTubeChannelResponseSchema.parse({ success: true, channel: channel }), 200);

  } catch (error: any) {
    console.error('Error getting YouTube channel by ID:', error);
    if (error instanceof z.ZodError) {
        console.error('Zod validation error during mapping getById result:', error.flatten());
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error processing channel data.'}), 500);
    }
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to retrieve YouTube channel.' }), 500);
  }
};
