import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  YouTubeChannelUpdateRequestSchema,
  YouTubeChannelUpdateResponseSchema,
  YouTubeChannelNotFoundErrorSchema,
  YouTubeChannelUpdateFailedErrorSchema,
  YouTubeChannelPlatformIdExistsErrorSchema
} from '../../schemas/youtube-channel.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/common.schemas';

export const updateYouTubeChannelHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({
      message: 'Invalid ID format in path.',
      errors: paramsValidation.error.flatten().fieldErrors,
    }), 400);
  }
  const { id } = paramsValidation.data;

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch {
    return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = YouTubeChannelUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({
      message: 'Invalid input for updating YouTube channel.',
      errors: validationResult.error.flatten().fieldErrors,
    }), 400);
  }

  const updateData = validationResult.data;

  if (Object.keys(updateData).length === 0) {
    return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ message: 'No update data provided.' }), 400);
  }

  try {
    const channel = await c.env.DB.prepare('SELECT youtube_platform_id FROM youtube_channels WHERE id = ?1').bind(id).first<{ youtube_platform_id: string }>();
    if (!channel) {
      return c.json(YouTubeChannelNotFoundErrorSchema.parse({ message: 'YouTube channel not found.' }), 404);
    }

    if (updateData.showId !== undefined) {
      const showExists = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1').bind(updateData.showId).first();
      if (!showExists) {
        return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ message: `Show with id ${updateData.showId} not found.` }), 404);
      }
    }

    const { youtubePlatformId } = updateData;
    if (youtubePlatformId && youtubePlatformId !== channel.youtube_platform_id) {
      const existing = await c.env.DB.prepare('SELECT id FROM youtube_channels WHERE youtube_platform_id = ?1 AND id != ?2').bind(youtubePlatformId, id).first();
      if (existing) {
        return c.json(YouTubeChannelPlatformIdExistsErrorSchema.parse({ 
          message: `A YouTube channel with platform ID '${youtubePlatformId}' already exists.` 
        }), 409);
      }
    }

    const dbUpdateData: Record<string, any> = {};
    if (updateData.showId !== undefined) dbUpdateData.show_id = updateData.showId;
    if (updateData.youtubePlatformId !== undefined) dbUpdateData.youtube_platform_id = updateData.youtubePlatformId;
    if (updateData.youtubePlatformCategoryId !== undefined) dbUpdateData.youtube_platform_category_id = updateData.youtubePlatformCategoryId;
    if (updateData.title !== undefined) dbUpdateData.title = updateData.title;
    if (updateData.description !== undefined) dbUpdateData.description = updateData.description;
    if (updateData.videoDescriptionTemplate !== undefined) dbUpdateData.video_description_template = updateData.videoDescriptionTemplate;
    if (updateData.firstCommentTemplate !== undefined) dbUpdateData.first_comment_template = updateData.firstCommentTemplate;
    if (updateData.languageCode !== undefined) dbUpdateData.language_code = updateData.languageCode;

    const fields = Object.keys(dbUpdateData).map(key => `${key} = ?`);
    const bindings = Object.values(dbUpdateData);
    
    if (fields.length === 0) {
      return c.json(YouTubeChannelUpdateResponseSchema.parse({ message: 'YouTube channel updated successfully.' }), 200);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    const stmt = c.env.DB.prepare(
      `UPDATE youtube_channels SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...bindings, id);

    await stmt.run();

    return c.json(YouTubeChannelUpdateResponseSchema.parse({ message: 'YouTube channel updated successfully.' }), 200);

  } catch (error: any) {
    console.error(`Error updating YouTube channel with ID ${id}:`, error);
    if (error.message?.includes('UNIQUE constraint failed: youtube_channels.youtube_platform_id')) {
      return c.json(YouTubeChannelPlatformIdExistsErrorSchema.parse({ 
        message: `A YouTube channel with platform ID '${updateData.youtubePlatformId}' already exists.` 
      }), 409);
    // Catch other DB constraint errors e.g. NOT NULL
    if (error.message && error.message.toLowerCase().includes('constraint failed')) {
        return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ message: `Database constraint failed: ${error.message}`}), 400);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to update YouTube channel due to a server error.' }), 500);
  }
};
