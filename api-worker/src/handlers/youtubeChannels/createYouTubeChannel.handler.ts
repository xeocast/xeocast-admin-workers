import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  YouTubeChannelCreateRequestSchema,
  YouTubeChannelCreateResponseSchema,
  YouTubeChannelCreateFailedErrorSchema,
  YouTubeChannelPlatformIdExistsErrorSchema
} from '../../schemas/youtubeChannelSchemas';
import { GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const createYouTubeChannelHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = YouTubeChannelCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for creating YouTube channel.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const {
    category_id,
    youtube_platform_id,
    name, // maps to DB 'title'
    description, // maps to DB 'description'
    default_language, // maps to DB 'language_code'
    default_category_id_on_youtube, // maps to DB 'youtube_platform_category_id'
    prompt_template_for_description, // maps to DB 'video_description_template'
    prompt_template_for_first_comment, // maps to DB 'first_comment_template'
    // Fields like custom_url, thumbnail_url, prompt_template_for_title, prompt_template_for_tags are ignored as they are not in DB table
  } = validationResult.data;

  // Explicit validation for fields that are NOT NULL in DB but optional in Zod schema
  if (description === undefined || description === null) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: "Field 'description' is required." }), 400);
  }
  if (!default_language) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: "Field 'default_language' is required." }), 400);
  }
  if (default_language.length !== 2 && default_language.length !== 5) { // Basic check for 'en' or 'en-US' like format
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: "Field 'default_language' must be a valid language code (e.g., 'en' or 'en-US')." }), 400);
  }
  if (!default_category_id_on_youtube) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: "Field 'default_category_id_on_youtube' is required." }), 400);
  }
  if (!prompt_template_for_description) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: "Field 'prompt_template_for_description' is required." }), 400);
  }
  if (!prompt_template_for_first_comment) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: "Field 'prompt_template_for_first_comment' is required." }), 400);
  }

  try {
    // Check if category_id exists in 'categories' table
    const categoryCheckStmt = c.env.DB.prepare('SELECT id FROM categories WHERE id = ?1').bind(category_id);
    const categoryExists = await categoryCheckStmt.first();
    if (!categoryExists) {
        return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: `Category with id ${category_id} not found.` }), 400);
    }

    const stmt = c.env.DB.prepare(
      'INSERT INTO youtube_channels (category_id, youtube_platform_id, title, description, language_code, youtube_platform_category_id, video_description_template, first_comment_template) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
    ).bind(
        category_id, 
        youtube_platform_id, 
        name, // Zod 'name' -> DB 'title'
        description, 
        default_language, // Zod 'default_language' -> DB 'language_code'
        default_category_id_on_youtube, // Zod 'default_category_id_on_youtube' -> DB 'youtube_platform_category_id'
        prompt_template_for_description, // Zod 'prompt_template_for_description' -> DB 'video_description_template'
        prompt_template_for_first_comment // Zod 'prompt_template_for_first_comment' -> DB 'first_comment_template'
    );
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(YouTubeChannelCreateResponseSchema.parse({
        success: true,
        message: 'YouTube channel created successfully.',
        channelId: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert YouTube channel, D1 result:', result);
      return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create YouTube channel.' }), 500);
    }

  } catch (error: any) {
    console.error('Error creating YouTube channel:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed: youtube_channels.youtube_platform_id')) {
      return c.json(YouTubeChannelPlatformIdExistsErrorSchema.parse({ success: false, message: 'YouTube platform ID already exists.' }), 400);
    }
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to create YouTube channel due to a server error.' }), 500);
  }
};
