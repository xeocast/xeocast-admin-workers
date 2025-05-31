import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeDeleteResponseSchema,
  EpisodeNotFoundErrorSchema,
  EpisodeDeleteFailedErrorSchema
} from '../../schemas/episodeSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const deleteEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    // First, check if the episode exists, as D1 `DELETE` might not error if the row doesn't exist but `changes` will be 0.
    const episodeExists = await c.env.DB.prepare('SELECT id FROM episodes WHERE id = ?1').bind(id).first<{ id: number }>();
    if (!episodeExists) {
      return c.json(EpisodeNotFoundErrorSchema.parse({ success: false, message: 'Episode not found.' }), 404);
    }

    // Note: This is a hard delete. Associated files in R2 and records in related tables
    // (e.g., episode_segments, episode_hosts, external_service_tasks) are not handled here.
    // A more robust solution would involve soft deletes or cascading cleanup.
    const stmt = c.env.DB.prepare('DELETE FROM episodes WHERE id = ?1').bind(id);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(EpisodeDeleteResponseSchema.parse({ success: true, message: 'Episode deleted successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // This case should ideally be caught by the existence check above, but as a safeguard:
      return c.json(EpisodeNotFoundErrorSchema.parse({ success: false, message: 'Episode not found or already deleted.' }), 404);
    } else {
      console.error('Failed to delete episode, D1 result:', result);
      // This could be due to a constraint if D1 enforced them on DELETE, or other D1 errors.
      return c.json(EpisodeDeleteFailedErrorSchema.parse({ success: false, message: 'Failed to delete episode.' }), 500);
    }

  } catch (error) {
    console.error('Error deleting episode:', error);
    // Catching potential errors from DB operations, though D1 errors might be generic.
    return c.json(EpisodeDeleteFailedErrorSchema.parse({ success: false, message: 'Failed to delete episode due to a server error.' }), 500);
  }
};
