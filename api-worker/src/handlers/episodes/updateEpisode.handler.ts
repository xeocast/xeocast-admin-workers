import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeUpdateRequestSchema,
  EpisodeUpdateResponseSchema,
  EpisodeNotFoundErrorSchema,
  EpisodeSlugExistsErrorSchema,
  EpisodeUpdateFailedErrorSchema
} from '../../schemas/episodeSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

export const updateEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = EpisodeUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(EpisodeUpdateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for updating episode.', 
        // errors: validationResult.error.flatten().fieldErrors // Optional
    }), 400);
  }

  const updatePayload = validationResult.data;
  // EpisodeUpdateRequestSchema (EpisodeBaseSchema.partial) ensures that if 'tags' or 'script' are provided,
  // they are already valid JSON strings (or undefined if not provided).
  // So, no manual stringification or defaulting to '[]' is needed here for these fields.
  // The database schema itself has defaults like '[]' for tags and script if they are not part of the UPDATE.

  const processedUpdatePayload: { [key: string]: any } = { ...updatePayload };

  // Slug will be handled after fetching existing episode and determining if it needs update.
  // Remove slug from processedUpdatePayload initially, it will be added back if it changes.
  let slugForUpdate: string | null | undefined = undefined;
  const originalSlugInPayload = updatePayload.slug; // Keep track of slug from payload
  delete processedUpdatePayload.slug; // Remove from direct iteration for SET clauses initially

  // Create a temporary payload for checking emptiness, excluding the original slug from this check
  // as its presence alone (even if unchanged) might not mean an update if other fields are empty.
  const tempPayloadForEmptinessCheck = { ...processedUpdatePayload };
  
  if (Object.keys(tempPayloadForEmptinessCheck).length === 0 && originalSlugInPayload === undefined) {
    return c.json(EpisodeUpdateResponseSchema.parse({ success: true, message: 'No update fields provided. Episode not changed.' }), 200);
  }

  try {
    // Check if episode exists
    const existingEpisode = await c.env.DB.prepare('SELECT id, title, slug, show_id, series_id FROM episodes WHERE id = ?1')
      .bind(id)
      .first<{ id: number; title: string; slug: string | null; show_id: number; series_id: number | null }>();

    if (!existingEpisode) {
      return c.json(EpisodeNotFoundErrorSchema.parse({ success: false, message: 'Episode not found.' }), 404);
    }

    // Slug processing logic
    let candidateSlug: string | null | undefined = undefined;
    let slugNeedsProcessing = false;

    const newTitle = updatePayload.title;
    const newSeriesId = updatePayload.series_id;

    if (originalSlugInPayload !== undefined) {
      slugNeedsProcessing = true;
      if (!originalSlugInPayload || originalSlugInPayload.startsWith('temp-slug-')) {
        const titleForSlug = newTitle || existingEpisode.title;
        candidateSlug = generateSlug(titleForSlug) || `episode-${id}-${Date.now()}`;
      } else {
        candidateSlug = originalSlugInPayload;
      }
    } else if ((newTitle && newTitle !== existingEpisode.title) || 
               (newSeriesId !== undefined && newSeriesId !== existingEpisode.series_id)) {
      // Regenerate slug if title or series_id changed, and slug was not explicitly provided
      slugNeedsProcessing = true;
      const titleForSlug = newTitle || existingEpisode.title;
      candidateSlug = generateSlug(titleForSlug) || `episode-${id}-${Date.now()}`;
    }

    if (slugNeedsProcessing && candidateSlug !== undefined) {
      const targetSeriesId = (newSeriesId !== undefined) ? newSeriesId : existingEpisode.series_id;
      const additionalConditions: Record<string, any> = { series_id: targetSeriesId ?? null }; 

      if (typeof candidateSlug === 'string' && candidateSlug.trim() !== '') {
        const uniqueSlug = await ensureUniqueSlug(c.env.DB, candidateSlug, 'episodes', 'slug', 'id', id, additionalConditions);
        if (uniqueSlug !== existingEpisode.slug) {
          slugForUpdate = uniqueSlug;
        }
      } else if (candidateSlug === null) { // Explicitly setting slug to null
        if (existingEpisode.slug !== null) {
          slugForUpdate = null;
        }
      } else { // Candidate slug is empty string
         if (existingEpisode.slug !== null && candidateSlug.trim() === '') {
            slugForUpdate = null; // Convert empty string to null if it's a change
        }
      }
    }

    // If slugForUpdate has a value (string or null), it means it's intended to be updated.
    if (slugForUpdate !== undefined) {
      processedUpdatePayload.slug = slugForUpdate;
    }

    // Validate show_id if provided
    if (updatePayload.show_id !== undefined) {
      const show = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1')
        .bind(updatePayload.show_id)
        .first<{ id: number }>();
      if (!show) {
        return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid show_id: Show does not exist.' }), 400);
      }
    }

    // Validate series_id if provided and not null
    if (updatePayload.series_id !== undefined && updatePayload.series_id !== null) {
      const series = await c.env.DB.prepare('SELECT id FROM series WHERE id = ?1')
        .bind(updatePayload.series_id)
        .first<{ id: number }>();
      if (!series) {
        return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid series_id: Series does not exist.' }), 400);
      }
    }
    // The DB triggers will handle series/show consistency, updated_at, and last_status_change_at.

    const setClauses: string[] = [];
    const bindings: any[] = [];
    let paramIndex = 1;

    Object.entries(processedUpdatePayload).forEach(([key, value]) => {
      if (value !== undefined) { // Ensure only defined values are part of update
        setClauses.push(`${key} = ?${paramIndex++}`);
        bindings.push(value);
      }
    });

    if (setClauses.length === 0) {
         // This case should be caught by the initial Object.keys check, but as a safeguard.
        return c.json(EpisodeUpdateResponseSchema.parse({ success: true, message: 'No effective update fields provided.' }), 200);
    }

    bindings.push(id); // For the WHERE clause
    const stmt = c.env.DB.prepare(`UPDATE episodes SET ${setClauses.join(', ')} WHERE id = ?${paramIndex}`);
    const result = await stmt.bind(...bindings).run();

    if (result.success) {
      if (result.meta.changes > 0) {
        return c.json(EpisodeUpdateResponseSchema.parse({ success: true, message: 'Episode updated successfully.' }), 200);
      } else {
        // Episode found, but data submitted was same as existing, or trigger prevented update without erroring explicitly here.
        return c.json(EpisodeUpdateResponseSchema.parse({ success: true, message: 'Episode found, but no effective changes were made.' }), 200);
      }
    } else {
      console.error('Failed to update episode, D1 result:', result);
      return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update episode.' }), 500);
    }

  } catch (error: any) {
    console.error('Error updating episode:', error);
    if (error.message && error.message.includes('CHECK constraint failed: status')) {
        return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: `Invalid status value. Please check allowed statuses. Received: ${updatePayload.status}` }), 400);
    }
    if (error.message && error.message.includes('Episode show_id must match series show_id')) {
        return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: 'Show and Series mismatch: The episode\'s show must match the series\'s show.' }), 400);
    }
    // Check for slug unique constraint (adjust based on actual D1 error message if different)
    if (error.message && (error.message.includes('UNIQUE constraint failed: episodes.slug'))) { // This might need to be more specific for slug+series_id
        return c.json(EpisodeSlugExistsErrorSchema.parse({ 
            success: false, 
            message: 'Episode slug already exists.'
        }), 400);
    }
    if (error.message && error.message.includes('Episode show_id must match series show_id')) {
        return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: 'Show and Series mismatch: The episode\'s show must match the series\'s show.' }), 400);
    }
    return c.json(EpisodeUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update episode due to a server error.' }), 500);
  }
};
