import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  PodcastDeleteResponseSchema,
  PodcastNotFoundErrorSchema,
  PodcastDeleteFailedErrorSchema
} from '../../schemas/podcastSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const deletePodcastHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    // First, check if the podcast exists, as D1 `DELETE` might not error if the row doesn't exist but `changes` will be 0.
    const podcastExists = await c.env.DB.prepare('SELECT id FROM podcasts WHERE id = ?1').bind(id).first<{ id: number }>();
    if (!podcastExists) {
      return c.json(PodcastNotFoundErrorSchema.parse({ success: false, message: 'Podcast not found.' }), 404);
    }

    // Note: This is a hard delete. Associated files in R2 and records in related tables
    // (e.g., podcast_segments, podcast_hosts, external_service_tasks) are not handled here.
    // A more robust solution would involve soft deletes or cascading cleanup.
    const stmt = c.env.DB.prepare('DELETE FROM podcasts WHERE id = ?1').bind(id);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(PodcastDeleteResponseSchema.parse({ success: true, message: 'Podcast deleted successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // This case should ideally be caught by the existence check above, but as a safeguard:
      return c.json(PodcastNotFoundErrorSchema.parse({ success: false, message: 'Podcast not found or already deleted.' }), 404);
    } else {
      console.error('Failed to delete podcast, D1 result:', result);
      // This could be due to a constraint if D1 enforced them on DELETE, or other D1 errors.
      return c.json(PodcastDeleteFailedErrorSchema.parse({ success: false, message: 'Failed to delete podcast.' }), 500);
    }

  } catch (error) {
    console.error('Error deleting podcast:', error);
    // Catching potential errors from DB operations, though D1 errors might be generic.
    return c.json(PodcastDeleteFailedErrorSchema.parse({ success: false, message: 'Failed to delete podcast due to a server error.' }), 500);
  }
};
