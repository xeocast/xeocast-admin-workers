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
    show_id: row.show_id,
    youtube_platform_id: row.youtube_platform_id,
    title: row.title,
    description: row.description,
    custom_url: row.custom_url || null, 
    thumbnail_url: row.thumbnail_url || null, 
    country: row.country || null, // Added field
    language_code: row.language_code, // Renamed from default_language
    youtube_playlist_id_for_uploads: row.youtube_playlist_id_for_uploads || null, // Added field
    youtube_platform_category_id: row.youtube_platform_category_id, // Renamed from default_show_id_on_youtube
    video_title_template: row.video_title_template || null, // Renamed from prompt_template_for_title
    video_description_template: row.video_description_template, // Renamed from prompt_template_for_description
    video_tags_template: row.video_tags_template || null, // Renamed from prompt_template_for_tags
    first_comment_template: row.first_comment_template, // Renamed from prompt_template_for_first_comment
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
      'SELECT id, show_id, youtube_platform_id, title, description, custom_url, thumbnail_url, country, language_code, youtube_playlist_id_for_uploads, youtube_platform_category_id, video_title_template, video_description_template, video_tags_template, first_comment_template, created_at, updated_at FROM youtube_channels WHERE id = ?1'
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
