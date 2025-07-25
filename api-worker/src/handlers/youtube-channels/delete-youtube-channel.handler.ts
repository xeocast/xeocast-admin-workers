import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  YouTubeChannelDeleteResponseSchema,
  YouTubeChannelNotFoundErrorSchema,
  YouTubeChannelDeleteFailedErrorSchema
} from '../../schemas/youtube-channel.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/common.schemas';

export const deleteYouTubeChannelHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({
      message: 'Invalid ID format in path.',
      errors: paramsValidation.error.flatten().fieldErrors,
    }), 400);
  }
  const { id } = paramsValidation.data;

  try {
    // Check if channel exists first to provide a clear 404 if it doesn't
    const existingChannel = await c.env.DB.prepare('SELECT id FROM youtube_channels WHERE id = ?1').bind(id).first();
    if (!existingChannel) {
      return c.json(YouTubeChannelNotFoundErrorSchema.parse({ message: 'YouTube channel not found.' }), 404);
    }

    // Check for dependencies in youtube_playlists
    const playlistDependency = await c.env.DB.prepare('SELECT id FROM youtube_playlists WHERE channel_id = ?1 LIMIT 1').bind(id).first();
    if (playlistDependency) {
      return c.json(YouTubeChannelDeleteFailedErrorSchema.parse({
        message: 'Cannot delete YouTube Channel: It is referenced by existing YouTube playlists. Please delete or reassign them first.',
      }), 409);
    }

    // Note: youtube_videos has ON DELETE CASCADE for youtube_channel_id, so they will be auto-deleted.

    const stmt = c.env.DB.prepare('DELETE FROM youtube_channels WHERE id = ?1').bind(id);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(YouTubeChannelDeleteResponseSchema.parse({ message: 'YouTube channel deleted successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // This case should ideally be caught by the initial existence check, but as a fallback:
      return c.json(YouTubeChannelNotFoundErrorSchema.parse({ message: 'YouTube channel not found or already deleted.' }), 404);
    } else {
      return c.json(YouTubeChannelDeleteFailedErrorSchema.parse({ message: 'Failed to delete YouTube channel.' }), 500);
    }

  } catch (error: any) {
    console.error(`Error deleting YouTube channel ${id}:`, error);
    // Check for any other foreign key constraint errors that might not have been caught
    if (error.message?.toLowerCase().includes('foreign key constraint failed')) {
      return c.json(YouTubeChannelDeleteFailedErrorSchema.parse({
        message: 'Cannot delete YouTube Channel: It is still referenced by other resources.',
      }), 409);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to delete YouTube channel due to a server error.' }), 500);
  }
};
