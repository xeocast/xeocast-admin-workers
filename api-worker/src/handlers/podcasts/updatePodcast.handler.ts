import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  PodcastUpdateRequestSchema,
  PodcastUpdateResponseSchema,
  PodcastNotFoundErrorSchema,
  PodcastUpdateFailedErrorSchema
} from '../../schemas/podcastSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const updatePodcastHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(PodcastUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = PodcastUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(PodcastUpdateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for updating podcast.', 
        // errors: validationResult.error.flatten().fieldErrors // Optional
    }), 400);
  }

  const updatePayload = validationResult.data;

  if (Object.keys(updatePayload).length === 0) {
    return c.json(PodcastUpdateResponseSchema.parse({ success: true, message: 'No update fields provided. Podcast not changed.' }), 200);
  }

  try {
    // Check if podcast exists
    const existingPodcast = await c.env.DB.prepare('SELECT id, category_id FROM podcasts WHERE id = ?1')
      .bind(id)
      .first<{ id: number; category_id: number }>();

    if (!existingPodcast) {
      return c.json(PodcastNotFoundErrorSchema.parse({ success: false, message: 'Podcast not found.' }), 404);
    }

    // Validate category_id if provided
    if (updatePayload.category_id !== undefined) {
      const category = await c.env.DB.prepare('SELECT id FROM categories WHERE id = ?1')
        .bind(updatePayload.category_id)
        .first<{ id: number }>();
      if (!category) {
        return c.json(PodcastUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid category_id: Category does not exist.' }), 400);
      }
    }

    // Validate series_id if provided and not null
    if (updatePayload.series_id !== undefined && updatePayload.series_id !== null) {
      const series = await c.env.DB.prepare('SELECT id FROM series WHERE id = ?1')
        .bind(updatePayload.series_id)
        .first<{ id: number }>();
      if (!series) {
        return c.json(PodcastUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid series_id: Series does not exist.' }), 400);
      }
    }
    
    // The DB triggers will handle series/category consistency, updated_at, and last_status_change_at.

    const setClauses: string[] = [];
    const bindings: any[] = [];
    let paramIndex = 1;

    Object.entries(updatePayload).forEach(([key, value]) => {
      if (value !== undefined) { // Ensure only defined values are part of update
        setClauses.push(`${key} = ?${paramIndex++}`);
        bindings.push(value);
      }
    });

    if (setClauses.length === 0) {
         // This case should be caught by the initial Object.keys check, but as a safeguard.
        return c.json(PodcastUpdateResponseSchema.parse({ success: true, message: 'No effective update fields provided.' }), 200);
    }

    bindings.push(id); // For the WHERE clause
    const stmt = c.env.DB.prepare(`UPDATE podcasts SET ${setClauses.join(', ')} WHERE id = ?${paramIndex}`);
    const result = await stmt.bind(...bindings).run();

    if (result.success) {
      if (result.meta.changes > 0) {
        return c.json(PodcastUpdateResponseSchema.parse({ success: true, message: 'Podcast updated successfully.' }), 200);
      } else {
        // Podcast found, but data submitted was same as existing, or trigger prevented update without erroring explicitly here.
        return c.json(PodcastUpdateResponseSchema.parse({ success: true, message: 'Podcast found, but no effective changes were made.' }), 200);
      }
    } else {
      console.error('Failed to update podcast, D1 result:', result);
      return c.json(PodcastUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update podcast.' }), 500);
    }

  } catch (error: any) {
    console.error('Error updating podcast:', error);
    if (error.message && error.message.includes('CHECK constraint failed: status')) {
        return c.json(PodcastUpdateFailedErrorSchema.parse({ success: false, message: `Invalid status value. Please check allowed statuses. Received: ${updatePayload.status}` }), 400);
    }
    if (error.message && error.message.includes('Podcast category_id must match series category_id')) {
        return c.json(PodcastUpdateFailedErrorSchema.parse({ success: false, message: 'Category and Series mismatch: The podcast\'s category must match the series\'s category.' }), 400);
    }
    return c.json(PodcastUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update podcast due to a server error.' }), 500);
  }
};
