import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi'; // Added zod import
import {
  YouTubeChannelSchema,
  ListYouTubeChannelsQuerySchema,
  ListYouTubeChannelsResponseSchema
} from '../../schemas/youtubeChannelSchemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

// Helper to map DB row to YouTubeChannelSchema compatible object
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

export const listYouTubeChannelsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParams = c.req.query();
  const validationResult = ListYouTubeChannelsQuerySchema.safeParse(queryParams);

  if (!validationResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        success: false, 
        message: 'Invalid query parameters.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { show_id } = validationResult.data;

  try {
    let query = 'SELECT id, show_id, youtube_platform_id, youtube_platform_category_id, title, description, video_description_template, first_comment_template, language_code, created_at, updated_at FROM youtube_channels';
    const bindings: any[] = [];

    if (show_id !== undefined) {
      query += ' WHERE show_id = ?1';
      bindings.push(show_id);
    }

    query += ' ORDER BY created_at DESC'; // Default ordering

    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const { results } = await stmt.all();

    const channels = results ? results.map(mapDbRowToYouTubeChannel) : [];
    
    return c.json(ListYouTubeChannelsResponseSchema.parse({ success: true, channels: channels }), 200);

  } catch (error: any) {
    console.error('Error listing YouTube channels:', error);
    // Check if it's a Zod parsing error during mapping
    if (error instanceof z.ZodError) {
        console.error('Zod validation error during mapping list results:', error.flatten());
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error processing channel data.'}), 500);
    }
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to list YouTube channels.' }), 500);
  }
};
