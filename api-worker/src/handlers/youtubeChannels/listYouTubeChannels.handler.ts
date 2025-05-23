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
    category_id: row.category_id,
    youtube_platform_id: row.youtube_platform_id,
    name: row.title, // DB 'title' -> Zod 'name'
    description: row.description,
    // Optional fields from Zod schema not in DB will be undefined/null based on schema
    custom_url: row.custom_url || null, // Assuming custom_url might be added to DB later
    thumbnail_url: row.thumbnail_url || null, // Assuming thumbnail_url might be added to DB later
    default_language: row.language_code, // DB 'language_code' -> Zod 'default_language'
    default_category_id_on_youtube: row.youtube_platform_category_id, // DB 'youtube_platform_category_id' -> Zod 'default_category_id_on_youtube'
    prompt_template_for_title: row.prompt_template_for_title || null, // Assuming this might be added
    prompt_template_for_description: row.video_description_template, // DB 'video_description_template' -> Zod 'prompt_template_for_description'
    prompt_template_for_tags: row.prompt_template_for_tags || null, // Assuming this might be added
    prompt_template_for_first_comment: row.first_comment_template, // DB 'first_comment_template' -> Zod 'prompt_template_for_first_comment'
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

  const { category_id } = validationResult.data;

  try {
    let query = 'SELECT id, category_id, youtube_platform_id, title, description, language_code, youtube_platform_category_id, video_description_template, first_comment_template, created_at, updated_at FROM youtube_channels';
    const bindings: any[] = [];

    if (category_id !== undefined) {
      query += ' WHERE category_id = ?1';
      bindings.push(category_id);
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
