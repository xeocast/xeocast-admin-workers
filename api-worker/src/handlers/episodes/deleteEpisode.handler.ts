import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeDeleteResponseSchema,
  EpisodeNotFoundErrorSchema,
  EpisodeDeleteFailedErrorSchema
} from '../../schemas/episodeSchemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const deleteEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const { id } = c.req.param();
  const episodeId = parseInt(id, 10);

  if (isNaN(episodeId) || episodeId <= 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({
      success: false,
      message: 'Invalid episode ID. Must be a positive integer.'
    }), 400);
  }

  try {
    // 1. Check if the episode exists
    const existingEpisode = await c.env.DB.prepare('SELECT id FROM episodes WHERE id = ?1')
      .bind(episodeId)
      .first<{ id: number }>();

    if (!existingEpisode) {
      return c.json(EpisodeNotFoundErrorSchema.parse({
        success: false,
        message: 'Episode not found.'
      }), 404);
    }

    // 2. Check for any dependencies before deletion
    // For example, if there are any references to this episode in other tables
    // This would depend on your database schema and relationships
    // For now, we'll assume there are no dependencies to check

    // 3. Delete the episode
    const stmt = c.env.DB.prepare('DELETE FROM episodes WHERE id = ?1')
      .bind(episodeId);

    const result = await stmt.run();

    if (!result.success) {
      console.error('Failed to delete episode, D1 result:', result);
      return c.json(EpisodeDeleteFailedErrorSchema.parse({
        success: false,
        message: 'Failed to delete episode.'
      }), 500);
    }

    // Check if any rows were affected (should be 1 if the episode was deleted)
    if (result.meta?.changes === 0) {
      // This should not happen since we already checked if the episode exists,
      // but it's good to handle this case anyway (e.g., if the episode was deleted concurrently)
      return c.json(EpisodeNotFoundErrorSchema.parse({
        success: false,
        message: 'Episode not found.'
      }), 404);
    }

    return c.json(EpisodeDeleteResponseSchema.parse({
      success: true,
      message: 'Episode deleted successfully.'
    }), 200);

  } catch (error) {
    console.error('Error deleting episode:', error);
    
    // Check for foreign key constraint violation error
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      return c.json(EpisodeDeleteFailedErrorSchema.parse({
        success: false,
        message: 'Cannot delete episode because it is referenced by other records.'
      }), 400);
    }
    
    return c.json(GeneralServerErrorSchema.parse({
      success: false,
      message: 'Failed to delete episode due to a server error.'
    }), 500);
  }
};