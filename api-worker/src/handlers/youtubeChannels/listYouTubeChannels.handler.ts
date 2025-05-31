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
    title: row.title,
    description: row.description,
    // Optional fields from Zod schema not in DB will be undefined/null based on schema
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
    created_at: row.created_at, // Assuming DATETIME strings are directly parsable by Zod
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
    let query = 'SELECT id, show_id, youtube_platform_id, title, description, custom_url, thumbnail_url, country, language_code, youtube_playlist_id_for_uploads, youtube_platform_category_id, video_title_template, video_description_template, video_tags_template, first_comment_template, created_at, updated_at FROM youtube_channels';
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
