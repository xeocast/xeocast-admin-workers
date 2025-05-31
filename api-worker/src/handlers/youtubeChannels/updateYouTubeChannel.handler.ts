import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  YouTubeChannelUpdateRequestSchema,
  YouTubeChannelUpdateResponseSchema,
  YouTubeChannelNotFoundErrorSchema,
  YouTubeChannelUpdateFailedErrorSchema,
  YouTubeChannelPlatformIdExistsErrorSchema
} from '../../schemas/youtubeChannelSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

export const updateYouTubeChannelHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format in path.' }), 400);
  }
  const id = parseInt(paramsValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = YouTubeChannelUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for updating YouTube channel.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const updateData = validationResult.data;

  if (Object.keys(updateData).length === 0) {
    return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ success: false, message: 'No update data provided.' }), 400);
  }

  try {
    // Check if channel exists
    const existingChannel = await c.env.DB.prepare('SELECT * FROM youtube_channels WHERE id = ?1').bind(id).first();
    if (!existingChannel) {
      return c.json(YouTubeChannelNotFoundErrorSchema.parse({ success: false, message: 'YouTube channel not found.' }), 404);
    }

    // Validate show_id if provided
    if (updateData.show_id !== undefined) {
      const showExists = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1').bind(updateData.show_id).first();
      if (!showExists) {
        return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ success: false, message: `Show with id ${updateData.show_id} not found.` }), 400);
      }
    }

    // Validate youtube_platform_id uniqueness if provided and changed
    if (updateData.youtube_platform_id !== undefined && updateData.youtube_platform_id !== existingChannel.youtube_platform_id) {
      const platformIdExists = await c.env.DB.prepare('SELECT id FROM youtube_channels WHERE youtube_platform_id = ?1 AND id != ?2')
        .bind(updateData.youtube_platform_id, id).first();
      if (platformIdExists) {
        return c.json(YouTubeChannelPlatformIdExistsErrorSchema.parse({ success: false, message: 'YouTube platform ID already exists for another channel.' }), 400);
      }
    }
    
    // Validate language_code format if provided
    // Language code format validation (e.g. min/max length) is now handled by the Zod schema.
    // if (updateData.language_code !== undefined && updateData.language_code !== null) { ... }

    const fieldsToUpdate: string[] = [];
    const bindings: any[] = [];
    let bindingIdx = 1;

    // Map Zod schema fields to DB columns
    const fieldMapping: { [key: string]: string } = {
      show_id: 'show_id',
      youtube_platform_id: 'youtube_platform_id',
      youtube_platform_category_id: 'youtube_platform_category_id',
      title: 'title',
      description: 'description',
      video_description_template: 'video_description_template',
      first_comment_template: 'first_comment_template',
      language_code: 'language_code',
    };

    for (const key in updateData) {
      if (Object.prototype.hasOwnProperty.call(updateData, key) && fieldMapping[key]) {
        const dbField = fieldMapping[key];
        // @ts-ignore
        const value = updateData[key];
        
        // Handle NOT NULL constraints: if a field is NOT NULL in DB, and user tries to set it to null, this will cause DB error.
        // For now, we pass it through and let DB handle it. A more robust check could be added here.
        fieldsToUpdate.push(`${dbField} = ?${bindingIdx}`);
        bindings.push(value);
        bindingIdx++;
      }
    }

    if (fieldsToUpdate.length === 0) {
      return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ success: false, message: 'No valid fields to update provided.' }), 400);
    }

    fieldsToUpdate.push(`updated_at = CURRENT_TIMESTAMP`);
    const query = `UPDATE youtube_channels SET ${fieldsToUpdate.join(', ')} WHERE id = ?${bindingIdx}`;
    bindings.push(id);

    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(YouTubeChannelUpdateResponseSchema.parse({ success: true, message: 'YouTube channel updated successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      return c.json(YouTubeChannelUpdateResponseSchema.parse({ success: true, message: 'No changes were made to the YouTube channel.' }), 200); // Or a 304 Not Modified, or a specific message
    } else {
      return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update YouTube channel.' }), 500);
    }

  } catch (error: any) {
    console.error('Error updating YouTube channel:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed: youtube_channels.youtube_platform_id')) {
      return c.json(YouTubeChannelPlatformIdExistsErrorSchema.parse({ success: false, message: 'YouTube platform ID already exists.' }), 400);
    }
    // Catch other DB constraint errors e.g. NOT NULL
    if (error.message && error.message.toLowerCase().includes('constraint failed')) {
        return c.json(YouTubeChannelUpdateFailedErrorSchema.parse({ success: false, message: `Database constraint failed: ${error.message}`}), 400);
    }
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to update YouTube channel due to a server error.' }), 500);
  }
};
