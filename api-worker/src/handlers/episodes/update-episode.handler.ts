import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeUpdateRequestSchema,
  EpisodeUpdateResponseSchema,
  EpisodeUpdateFailedErrorSchema,
  EpisodeNotFoundErrorSchema,
  EpisodeSlugExistsErrorSchema
} from '../../schemas/episode.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../../schemas/common.schemas';
import { generateSlug } from '../../utils/slugify';

export const updateEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramParseResult = PathIdParamSchema.safeParse(c.req.param());

  if (!paramParseResult.success) {
    return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Invalid episode ID format.' }), 400);
  }
  const { id } = paramParseResult.data;

  const body = await c.req.json();
  const parseResult = EpisodeUpdateRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json(EpisodeUpdateFailedErrorSchema.parse({
            message: 'Invalid request body.',
      errors: parseResult.error.flatten().fieldErrors,
    }), 400);
  }

  const updates = parseResult.data;

  if (Object.keys(updates).length === 0) {
    return c.json(EpisodeUpdateFailedErrorSchema.parse({
            message: 'No update fields provided.',
    }), 400);
  }

  try {
    // Fetch the current episode to get show_id and series_id if slug or title is being updated
    const currentEpisode = await c.env.DB.prepare('SELECT slug, title, show_id, series_id FROM episodes WHERE id = ?1')
      .bind(id)
      .first<{ slug: string; title: string; show_id: number; series_id: number | null }>();

    if (!currentEpisode) {
      return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Episode not found.' }), 404);
    }

    let newSlug = updates.slug;
    if (updates.title && (!updates.slug || updates.slug.trim() === '')) {
      // If title is updated and slug is not provided (or is empty), regenerate slug
      newSlug = generateSlug(updates.title);
    } else if (updates.slug) {
      // If slug is explicitly provided, use it (it might be an intentional change)
      newSlug = updates.slug;
    }

    // If slug has changed or is being generated, check for uniqueness
    if (newSlug && newSlug !== currentEpisode.slug) {
      let slugCheckQuery;
      const targetShowId = updates.show_id ?? currentEpisode.show_id;
      const targetSeriesId = updates.series_id !== undefined ? updates.series_id : currentEpisode.series_id;

      if (targetSeriesId) {
        slugCheckQuery = c.env.DB.prepare('SELECT id FROM episodes WHERE slug = ?1 AND show_id = ?2 AND series_id = ?3 AND id != ?4')
          .bind(newSlug, targetShowId, targetSeriesId, id);
      } else {
        slugCheckQuery = c.env.DB.prepare('SELECT id FROM episodes WHERE slug = ?1 AND show_id = ?2 AND series_id IS NULL AND id != ?3')
          .bind(newSlug, targetShowId, id);
      }
      const existingEpisodeWithSlug = await slugCheckQuery.first();
      if (existingEpisodeWithSlug) {
        return c.json(EpisodeSlugExistsErrorSchema.parse({
                    message: 'Episode slug already exists for this show/series combination.',
        }), 400);
      }
      updates.slug = newSlug; // Ensure the updates object has the new slug
    }

    const fieldsToUpdate: string[] = [];
    const bindings: any[] = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) { // Only include fields that are actually being updated
        fieldsToUpdate.push(`${key} = ?${paramIndex++}`);
        if (key === 'freezeStatus' && typeof value === 'boolean') {
          bindings.push(value ? 1 : 0); // Convert boolean to 0/1 for SQLite
        } else {
          bindings.push(value);
        }
      }
    });

    if (fieldsToUpdate.length === 0) {
      // This can happen if only `slug` was in `updates` but it was the same as current, or if title was updated but generated slug was same
      // Or if all values were undefined (though caught earlier by Object.keys(updates).length === 0)
      return c.json(EpisodeUpdateResponseSchema.parse({ message: 'No changes detected to update.' }), 200);
    }

    // Add updated_at timestamp
    fieldsToUpdate.push(`updated_at = CURRENT_TIMESTAMP`);
    // Add last_status_change_at if status is changing
    if (updates.status !== undefined) {
        fieldsToUpdate.push(`last_status_change_at = CURRENT_TIMESTAMP`);
    }

    bindings.push(id); // For the WHERE clause

    const updateStatement = `UPDATE episodes SET ${fieldsToUpdate.join(', ')} WHERE id = ?${paramIndex}`;
    const result = await c.env.DB.prepare(updateStatement).bind(...bindings).run();

    if (result.success && result.meta.changes > 0) {
      return c.json(EpisodeUpdateResponseSchema.parse({ message: 'Episode updated successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // This could mean the episode was not found, or the data provided was identical to existing data
      // We already check for not found, so this means data was identical or no effective change
      return c.json(EpisodeUpdateResponseSchema.parse({ message: 'Episode updated successfully (no changes applied).' }), 200);
    } else {
      console.error('Failed to update episode, D1 result:', result);
      return c.json(EpisodeUpdateFailedErrorSchema.parse({
                message: 'Failed to update episode in the database.',
      }), 500);
    }
  } catch (error) {
    console.error(`Error updating episode ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({
            message: 'An unexpected error occurred while updating the episode.',
    }), 500);
  }
};