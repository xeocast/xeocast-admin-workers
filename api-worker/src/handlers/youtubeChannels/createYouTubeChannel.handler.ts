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
    show_id,
    youtube_platform_id,
    title, // formerly name
    description,
    language_code, // formerly default_language
    youtube_platform_category_id, // formerly default_show_id_on_youtube
    video_description_template, // formerly prompt_template_for_description
    first_comment_template, // formerly prompt_template_for_first_comment
    custom_url,
    thumbnail_url,
    country,
    youtube_playlist_id_for_uploads,
    video_title_template,
    video_tags_template,
    
  } = validationResult.data;

  // Validations for fields now handled by Zod schema (required, specific formats like language_code length)

  try {
    // Check if show_id exists in 'shows' table
    const showCheckStmt = c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1').bind(show_id);
    const showExists = await showCheckStmt.first();
    if (!showExists) {
        return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ success: false, message: `Show with id ${show_id} not found.` }), 400);
    }

    const stmt = c.env.DB.prepare(
      'INSERT INTO youtube_channels (show_id, youtube_platform_id, title, description, custom_url, thumbnail_url, country, language_code, youtube_playlist_id_for_uploads, youtube_platform_category_id, video_title_template, video_description_template, video_tags_template, first_comment_template) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)'
    ).bind(
        show_id, 
        youtube_platform_id, 
        title, 
        description, 
        custom_url, 
        thumbnail_url, 
        country, 
        language_code, 
        youtube_playlist_id_for_uploads, 
        youtube_platform_category_id, 
        video_title_template, 
        video_description_template, 
        video_tags_template, 
        first_comment_template
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
