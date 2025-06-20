import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeDeleteResponseSchema,
  EpisodeNotFoundErrorSchema,
  EpisodeDeleteFailedErrorSchema
} from '../../schemas/episodeSchemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const deleteEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramParseResult = PathIdParamSchema.safeParse(c.req.param());

  if (!paramParseResult.success) {
    return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Invalid episode ID format.' }), 400);
  }
  const { id } = paramParseResult.data;

  try {
    // First, check if the episode exists
    const episodeExists = await c.env.DB.prepare('SELECT id FROM episodes WHERE id = ?1').bind(id).first();
    if (!episodeExists) {
      return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Episode not found.' }), 404);
    }

    const result = await c.env.DB.prepare('DELETE FROM episodes WHERE id = ?1').bind(id).run();

    if (result.success && result.meta.changes > 0) {
      return c.json(EpisodeDeleteResponseSchema.parse({ message: 'Episode deleted successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // This case should ideally be caught by the check above, but as a fallback:
      return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Episode not found, nothing to delete.' }), 404);
    } else {
      console.error('Failed to delete episode, D1 result:', result);
      return c.json(EpisodeDeleteFailedErrorSchema.parse({
                message: 'Failed to delete episode from the database.',
      }), 500);
    }
  } catch (error) {
    console.error(`Error deleting episode ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({
            message: 'An unexpected error occurred while deleting the episode.',
    }), 500);
  }
};