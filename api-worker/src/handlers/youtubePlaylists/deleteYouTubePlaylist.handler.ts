import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  YouTubePlaylistDeleteResponseSchema,
  YouTubePlaylistNotFoundErrorSchema,
  YouTubePlaylistDeleteFailedErrorSchema // Using this for general delete failure
} from '../../schemas/youtubePlaylistSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

export const deleteYouTubePlaylistHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramsValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramsValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format in path.' }), 400);
  }
  const id = parseInt(paramsValidation.data.id, 10);

  try {
    // 1. Check if playlist exists before attempting delete
    const playlistCheckStmt = c.env.DB.prepare('SELECT id FROM youtube_playlists WHERE id = ?1').bind(id);
    const existingPlaylist = await playlistCheckStmt.first();

    if (!existingPlaylist) {
      return c.json(YouTubePlaylistNotFoundErrorSchema.parse({ success: false, message: 'YouTube playlist not found.' }), 404);
    }

    // 2. Delete the playlist
    // No direct episode dependencies to check in youtube_playlists table itself based on current schema.
    // If there were indirect dependencies (e.g. a join table or episodes having youtube_playlist_id),
    // those would need checking here.
    const deleteStmt = c.env.DB.prepare('DELETE FROM youtube_playlists WHERE id = ?1').bind(id);
    const dbResult = await deleteStmt.run();

    if (dbResult.success) {
      // D1 success for DELETE means changes > 0 or no error. Check changes if needed.
      // For a simple delete by ID, if it didn't throw and didn't find (already handled), it's likely fine.
      return c.json(YouTubePlaylistDeleteResponseSchema.parse({ success: true, message: 'YouTube playlist deleted successfully.' }), 200);
    } else {
      // This path might be less common if D1 throws errors for failures.
      console.error(`DB delete failed for YouTube playlist ID ${id}:`, dbResult.error || 'Unknown D1 error');
      return c.json(YouTubePlaylistDeleteFailedErrorSchema.parse({ success: false, message: 'Failed to delete YouTube playlist due to a database error.' }), 500);
    }

  } catch (error: any) {
    console.error(`Error deleting YouTube playlist ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to delete YouTube playlist due to a server error.' }), 500);
  }
};
