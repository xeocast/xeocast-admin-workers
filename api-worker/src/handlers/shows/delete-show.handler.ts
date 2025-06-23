import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  ShowDeleteResponseSchema,
  ShowNotFoundErrorSchema,
  ShowDeleteFailedErrorSchema
} from '../../schemas/show.schemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema } from '../../schemas/common.schemas';

export const deleteShowHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    // Check if show exists
    const showExists = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1').bind(id).first<{ id: number }>();
    if (!showExists) {
      return c.json(ShowNotFoundErrorSchema.parse({ message: 'Show not found.' }), 404);
    }

    // Check for dependencies: episodes
    const dependentEpisodes = await c.env.DB.prepare('SELECT id FROM episodes WHERE show_id = ?1 LIMIT 1').bind(id).first<{ id: number }>();
    if (dependentEpisodes) {
      return c.json(ShowDeleteFailedErrorSchema.parse({ message: 'Cannot delete show: It is referenced by existing episodes.' }), 400);
    }

    // Check for dependencies: series
    const dependentSeries = await c.env.DB.prepare('SELECT id FROM series WHERE show_id = ?1 LIMIT 1').bind(id).first<{ id: number }>();
    if (dependentSeries) {
      return c.json(ShowDeleteFailedErrorSchema.parse({ message: 'Cannot delete show: It is referenced by existing series.' }), 400);
    }
    
    // Check for dependencies: youtube_channels
    const dependentYouTubeChannels = await c.env.DB.prepare('SELECT id FROM youtube_channels WHERE show_id = ?1 LIMIT 1').bind(id).first<{ id: number }>();
    if (dependentYouTubeChannels) {
        return c.json(ShowDeleteFailedErrorSchema.parse({ message: 'Cannot delete show: It is referenced by existing YouTube channels.' }), 400);
    }

    const stmt = c.env.DB.prepare('DELETE FROM shows WHERE id = ?1').bind(id);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(ShowDeleteResponseSchema.parse({ message: 'Show deleted successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
        // This case should ideally be caught by the existence check, but as a safeguard:
        return c.json(ShowNotFoundErrorSchema.parse({ message: 'Show not found or already deleted.' }), 404);
    }else {
      console.error('Failed to delete show, D1 result:', result);
      return c.json(ShowDeleteFailedErrorSchema.parse({ message: 'Failed to delete show.' }), 500);
    }

  } catch (error) {
    console.error('Error deleting show:', error);
    // This could be a foreign key constraint error if not caught by manual checks, though D1 might not enforce them by default
    return c.json(ShowDeleteFailedErrorSchema.parse({ message: 'Failed to delete show due to an unexpected error.' }), 500);
  }
};
