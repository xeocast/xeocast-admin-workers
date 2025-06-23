import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi';
import {
  YouTubeChannelSchema,
  GetYouTubeChannelResponseSchema,
  YouTubeChannelNotFoundErrorSchema
} from '../../schemas/youtube-channel.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/common.schemas';

// Helper to map DB row to YouTubeChannelSchema compatible object (can be shared or defined locally)
const mapDbRowToYouTubeChannel = (row: any): z.infer<typeof YouTubeChannelSchema> => {
  return YouTubeChannelSchema.parse({
    id: row.id,
    show_id: row.show_id,
    youtube_platform_id: row.youtube_platform_id,
    youtube_platform_category_id: row.youtube_platform_category_id,
    title: row.title,
    description: row.description,
    video_description_template: row.video_description_template,
    first_comment_template: row.first_comment_template,
    language_code: row.language_code,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
};

export const getYouTubeChannelByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        
        message: 'Invalid ID format in path.',
        // errors: paramsValidation.error.flatten().fieldErrors 
    }), 400);
  }

  const id = parseInt(paramsValidation.data.id, 10);

  try {
    const stmt = c.env.DB.prepare(
      'SELECT id, show_id, youtube_platform_id, youtube_platform_category_id, title, description, video_description_template, first_comment_template, language_code, created_at, updated_at FROM youtube_channels WHERE id = ?1'
    ).bind(id);
    
    const row = await stmt.first();

    if (!row) {
      return c.json(YouTubeChannelNotFoundErrorSchema.parse({ message: 'YouTube channel not found.' }), 404);
    }

    const channel = mapDbRowToYouTubeChannel(row);
    return c.json(GetYouTubeChannelResponseSchema.parse({ channel: channel }), 200);

  } catch (error: any) {
    console.error('Error getting YouTube channel by ID:', error);
    if (error instanceof z.ZodError) {
        console.error('Zod validation error during mapping getById result:', error.flatten());
        return c.json(GeneralServerErrorSchema.parse({ message: 'Error processing channel data.'}), 500);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to retrieve YouTube channel.' }), 500);
  }
};
