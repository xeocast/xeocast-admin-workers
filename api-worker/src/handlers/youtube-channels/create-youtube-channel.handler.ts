import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  YouTubeChannelCreateRequestSchema,
  YouTubeChannelCreateResponseSchema,
  YouTubeChannelCreateFailedErrorSchema,
  YouTubeChannelPlatformIdExistsErrorSchema
} from '../../schemas/youtube-channel.schemas';
import { GeneralServerErrorSchema } from '../../schemas/common.schemas';

export const createYouTubeChannelHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch {

    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = YouTubeChannelCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(YouTubeChannelCreateFailedErrorSchema.parse({
      message: 'Invalid input for creating YouTube channel.',
      errors: validationResult.error.flatten().fieldErrors,
    }), 400);
  }

  const {
    showId,
    youtubePlatformId,
    title,
    description,
    languageCode,
    youtubePlatformCategoryId,
    videoDescriptionTemplate,
    firstCommentTemplate,
  } = validationResult.data;

  try {
    const showExists = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1').bind(showId).first();
    if (!showExists) {
      return c.json(YouTubeChannelCreateFailedErrorSchema.parse({ message: `Show with id ${showId} not found.` }), 404);
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO youtube_channels (show_id, youtube_platform_id, youtube_platform_category_id, title, description, video_description_template, first_comment_template, language_code) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)',
    ).bind(
      showId, youtubePlatformId, youtubePlatformCategoryId, title, description, videoDescriptionTemplate, firstCommentTemplate, languageCode
    ).run();

    return c.json(YouTubeChannelCreateResponseSchema.parse({
      message: 'YouTube channel created successfully.',
      id: result.meta.last_row_id,
    }), 201);

  } catch (error: any) {
    console.error(`Error creating YouTube channel for show ${showId}:`, error);
    if (error.message?.includes('UNIQUE constraint failed: youtube_channels.youtube_platform_id')) {
      return c.json(YouTubeChannelPlatformIdExistsErrorSchema.parse({ 
        message: `A YouTube channel with platform ID '${youtubePlatformId}' already exists.`
      }), 409);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to create YouTube channel due to a server error.' }), 500);
  }
};
