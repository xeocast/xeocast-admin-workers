import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeUpdateRequestSchema,
  EpisodeUpdateResponseSchema,
  EpisodeNotFoundErrorSchema,
  EpisodeUpdateFailedErrorSchema,
  EpisodeSlugExistsErrorSchema
} from '../../schemas/episodeSchemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

export const updateEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const { id } = c.req.param();
  const episodeId = parseInt(id, 10);

  if (isNaN(episodeId) || episodeId <= 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({
      success: false,
      message: 'Invalid episode ID. Must be a positive integer.'
    }), 400);
  }

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(EpisodeUpdateFailedErrorSchema.parse({
      success: false,
      message: 'Failed to update episode.'
    }), 400);
  }

  const validationResult = EpisodeUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(EpisodeUpdateFailedErrorSchema.parse({
      success: false,
      message: 'Failed to update episode.'
    }), 400);
  }

  const updateData = validationResult.data;
  
  try {
    // 1. Check if the episode exists
    const existingEpisode = await c.env.DB.prepare('SELECT * FROM episodes WHERE id = ?1')
      .bind(episodeId)
      .first<any>();

    if (!existingEpisode) {
      return c.json(EpisodeNotFoundErrorSchema.parse({
        success: false,
        message: 'Episode not found.'
      }), 404);
    }

    // 2. Process slug if it's being updated
    let slug = updateData.slug;
    if (slug) {
      if (slug.startsWith('temp-slug-')) {
        // Generate a new slug from the title (either the updated title or the existing one)
        const titleForSlug = updateData.title || existingEpisode.title;
        const newSlug = generateSlug(titleForSlug);
        slug = newSlug || `episode-${Date.now()}`;
      }

      // Check if the new slug already exists for a different episode
      if (slug !== existingEpisode.slug) {
        const slugExists = await c.env.DB.prepare('SELECT id FROM episodes WHERE slug = ?1 AND id != ?2')
          .bind(slug, episodeId)
          .first<{ id: number }>();

        if (slugExists) {
          return c.json(EpisodeSlugExistsErrorSchema.parse({
            success: false,
            message: 'Episode slug already exists in this series.'
          }), 400);
        }

        // Ensure the slug is unique
        slug = await ensureUniqueSlug(c.env.DB, slug, 'episodes', 'slug', 'id', episodeId);
        updateData.slug = slug;
      }
    }

    // 3. Validate show_id and series_id if they're being updated
    if (updateData.show_id) {
      const showExists = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1')
        .bind(updateData.show_id)
        .first<{ id: number }>();

      if (!showExists) {
        return c.json(GeneralBadRequestErrorSchema.parse({
          success: false,
          message: 'Show not found.'
        }), 400);
      }

      // If series_id is provided or already exists, ensure it belongs to the new show_id
      const seriesId = updateData.series_id !== undefined ? updateData.series_id : existingEpisode.series_id;
      if (seriesId !== null) {
        const seriesExists = await c.env.DB.prepare('SELECT id, show_id FROM series WHERE id = ?1')
          .bind(seriesId)
          .first<{ id: number, show_id: number }>();

        if (!seriesExists) {
          return c.json(GeneralBadRequestErrorSchema.parse({
            success: false,
            message: 'Series not found.'
          }), 400);
        }

        if (seriesExists.show_id !== updateData.show_id) {
          return c.json(GeneralBadRequestErrorSchema.parse({
            success: false,
            message: 'The specified series does not belong to the specified show.'
          }), 400);
        }
      }
    } else if (updateData.series_id !== undefined && updateData.series_id !== null) {
      // If only series_id is being updated (show_id remains the same)
      const seriesExists = await c.env.DB.prepare('SELECT id, show_id FROM series WHERE id = ?1')
        .bind(updateData.series_id)
        .first<{ id: number, show_id: number }>();

      if (!seriesExists) {
        return c.json(GeneralBadRequestErrorSchema.parse({
          success: false,
          message: 'Series not found.'
        }), 400);
      }

      if (seriesExists.show_id !== existingEpisode.show_id) {
        return c.json(GeneralBadRequestErrorSchema.parse({
          success: false,
          message: 'The specified series does not belong to the show of this episode.'
        }), 400);
      }
    }

    // 4. Process JSON fields if they're being updated
    if (updateData.tags !== undefined && typeof updateData.tags !== 'string') {
      // If tags is provided but not as a string, it might be an array that needs to be stringified
      try {
        updateData.tags = JSON.stringify(updateData.tags);
      } catch (e) {
        return c.json(EpisodeUpdateFailedErrorSchema.parse({
          success: false,
          message: 'Invalid tags format. Must be a valid JSON string or array.'
        }), 400);
      }
    }

    if (updateData.script !== undefined && typeof updateData.script !== 'string') {
      // If script is provided but not as a string, it might be an object that needs to be stringified
      try {
        updateData.script = JSON.stringify(updateData.script);
      } catch (e) {
        return c.json(EpisodeUpdateFailedErrorSchema.parse({
          success: false,
          message: 'Invalid script format. Must be a valid JSON string or object.'
        }), 400);
      }
    }

    // 5. Update the status change timestamp if status is being updated
    if (updateData.status && updateData.status !== existingEpisode.status) {
      // Use type assertion to add the last_status_change_at property
      (updateData as any).last_status_change_at = new Date().toISOString();
    }

    // 6. Build the SQL update statement dynamically based on the fields to update
    const updateFields = Object.keys(updateData).filter(key => updateData[key as keyof typeof updateData] !== undefined);
    
    if (updateFields.length === 0) {
      return c.json(EpisodeUpdateResponseSchema.parse({
        success: true,
        message: 'No changes to update.'
      }), 200);
    }

    const setClause = updateFields.map((field, index) => `${field} = ?${index + 1}`).join(', ');
    const updateValues = updateFields.map(field => updateData[field as keyof typeof updateData]);
    
    const stmt = c.env.DB.prepare(`
      UPDATE episodes
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?${updateFields.length + 1}
    `).bind(...updateValues, episodeId);

    const result = await stmt.run();

    if (!result.success) {
      console.error('Failed to update episode, D1 result:', result);
      return c.json(EpisodeUpdateFailedErrorSchema.parse({
        success: false,
        message: 'Failed to update episode.'
      }), 500);
    }

    return c.json(EpisodeUpdateResponseSchema.parse({
      success: true,
      message: 'Episode updated successfully.'
    }), 200);

  } catch (error) {
    console.error('Error updating episode:', error);
    // Check for unique constraint violation error
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed: episodes.slug')) {
        return c.json(EpisodeSlugExistsErrorSchema.parse({
          success: false,
          message: 'Episode slug already exists in this series.'
        }), 400);
      }
    }
    return c.json(GeneralServerErrorSchema.parse({
      success: false,
      message: 'Failed to update episode due to a server error.'
    }), 500);
  }
};