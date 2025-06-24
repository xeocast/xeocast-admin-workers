import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  YouTubePlaylistUpdateRequestSchema,
  YouTubePlaylistUpdateResponseSchema,
  YouTubePlaylistNotFoundErrorSchema,
  YouTubePlaylistPlatformIdExistsErrorSchema,
  YouTubePlaylistUpdateFailedErrorSchema // Generic update failure
} from '../../schemas/youtube-playlist.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/common.schemas';

export const updateYouTubePlaylistHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid ID format in path.' }), 400);
  }
  const id = parseInt(paramsValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid JSON payload.' }), 400);
  }

  const bodyValidation = YouTubePlaylistUpdateRequestSchema.safeParse(requestBody);
  if (!bodyValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid request body.', details: bodyValidation.error.flatten() }), 400);
  }
  const updateData = bodyValidation.data;

  if (Object.keys(updateData).length === 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'No fields provided for update.' }), 400);
  }

  try {
    // 1. Check if playlist exists
    const existingPlaylistStmt = c.env.DB.prepare('SELECT youtube_platform_id, channel_id, series_id FROM youtube_playlists WHERE id = ?1').bind(id);
    const existingPlaylist = await existingPlaylistStmt.first<{ youtube_platform_id: string; channel_id: number; series_id: number }>();

    if (!existingPlaylist) {
      return c.json(YouTubePlaylistNotFoundErrorSchema.parse({ message: 'YouTube playlist not found.' }), 404);
    }

    // 2. Validate youtube_platform_id uniqueness if changed
    if (updateData.youtubePlatformId && updateData.youtubePlatformId !== existingPlaylist.youtube_platform_id) {
      const platformIdCheckStmt = c.env.DB.prepare('SELECT id FROM youtube_playlists WHERE youtube_platform_id = ?1 AND id != ?2').bind(updateData.youtubePlatformId, id);
      const platformIdConflict = await platformIdCheckStmt.first();
      if (platformIdConflict) {
        return c.json(YouTubePlaylistPlatformIdExistsErrorSchema.parse({ message: 'YouTube playlist platform ID already exists.' }), 400);
      }
    }

    // 3. Validate series_id existence if changed
    if (updateData.seriesId && updateData.seriesId !== existingPlaylist.series_id) {
      const seriesCheckStmt = c.env.DB.prepare('SELECT id FROM series WHERE id = ?1').bind(updateData.seriesId);
      const seriesExists = await seriesCheckStmt.first();
      if (!seriesExists) {
        return c.json(GeneralBadRequestErrorSchema.parse({ message: `Series with ID ${updateData.seriesId} not found.` }), 400);
      }
    }

    // 4. Validate channel_id existence if changed
    if (updateData.channelId && updateData.channelId !== existingPlaylist.channel_id) {
      const channelCheckStmt = c.env.DB.prepare('SELECT id FROM youtube_channels WHERE id = ?1').bind(updateData.channelId);
      const channelExists = await channelCheckStmt.first();
      if (!channelExists) {
        return c.json(GeneralBadRequestErrorSchema.parse({ message: `YouTube channel with ID ${updateData.channelId} not found.` }), 400);
      }
    }

    // 5. Construct and execute UPDATE query
    const fieldsToUpdate: string[] = [];
    const bindings: any[] = [];
    let bindingIdx = 1;

    if (updateData.title !== undefined) { fieldsToUpdate.push('title = ?' + bindingIdx++); bindings.push(updateData.title); }
    if (updateData.description !== undefined) { fieldsToUpdate.push('description = ?' + bindingIdx++); bindings.push(updateData.description); }
    if (updateData.youtubePlatformId !== undefined) { fieldsToUpdate.push('youtube_platform_id = ?' + bindingIdx++); bindings.push(updateData.youtubePlatformId); }
    if (updateData.seriesId !== undefined) { fieldsToUpdate.push('series_id = ?' + bindingIdx++); bindings.push(updateData.seriesId); }
    if (updateData.channelId !== undefined) { fieldsToUpdate.push('channel_id = ?' + bindingIdx++); bindings.push(updateData.channelId); }
    // Note: thumbnail_url is not in the DB table for playlists, so it's ignored.

    if (fieldsToUpdate.length === 0) {
      // This case should be caught earlier, but as a safeguard:
      return c.json(GeneralBadRequestErrorSchema.parse({ message: 'No updatable fields provided.' }), 400);
    }

    fieldsToUpdate.push('updated_at = strftime(\'%Y-%m-%dT%H:%M:%fZ\', \'now\')');

    const query = `UPDATE youtube_playlists SET ${fieldsToUpdate.join(', ')} WHERE id = ?${bindingIdx}`;
    bindings.push(id);

    const updateStmt = c.env.DB.prepare(query).bind(...bindings);
    const dbResult = await updateStmt.run();

    if (dbResult.success) {
      return c.json(YouTubePlaylistUpdateResponseSchema.parse({ message: 'YouTube playlist updated successfully.' }), 200);
    } else {
      // This part might not be reached if DB errors throw exceptions directly
      console.error('DB update failed:', dbResult.error || 'Unknown D1 error');
      return c.json(YouTubePlaylistUpdateFailedErrorSchema.parse({ message: 'Failed to update YouTube playlist due to a database error.'}), 500);
    }

  } catch (error: any) {
    console.error(`Error updating YouTube playlist ID ${id}:`, error);
    // Check for specific D1 constraint errors if possible, e.g., UNIQUE constraint on youtube_platform_id
    if (error.message && error.message.includes('UNIQUE constraint failed: youtube_playlists.youtube_platform_id')) {
        return c.json(YouTubePlaylistPlatformIdExistsErrorSchema.parse({ message: 'YouTube playlist platform ID already exists.' }), 400);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to update YouTube playlist due to a server error.' }), 500);
  }
};
