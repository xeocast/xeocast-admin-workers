import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  SeriesUpdateRequestSchema,
  SeriesUpdateResponseSchema,
  SeriesNotFoundErrorSchema,
  SeriesSlugExistsErrorSchema,
  SeriesUpdateFailedErrorSchema
} from '../../schemas/seriesSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';
import { generateSlug } from '../../utils/slugify';

interface ExistingSeries {
  id: number;
  title: string;
  slug: string | null; // Added slug
  category_id: number;
}

export const updateSeriesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(SeriesUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }
  console.log(requestBody);

  const validationResult = SeriesUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(SeriesUpdateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for updating series.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const updateData = validationResult.data;

  if (Object.keys(updateData).length === 0) {
    return c.json(SeriesUpdateResponseSchema.parse({ success: true, message: 'Series updated successfully.' }), 200); // Or a 304 Not Modified like response
  }

  try {
    // 1. Fetch existing series
    const existingSeries = await c.env.DB.prepare('SELECT id, title, slug, category_id FROM series WHERE id = ?1')
      .bind(id)
      .first<ExistingSeries>();

    if (!existingSeries) {
      return c.json(SeriesNotFoundErrorSchema.parse({ success: false, message: 'Series not found.' }), 404);
    }

    // 2. Validate category_id if changed
    if (updateData.category_id !== undefined && updateData.category_id !== existingSeries.category_id) {
      const categoryExists = await c.env.DB.prepare('SELECT id FROM categories WHERE id = ?1')
        .bind(updateData.category_id)
        .first<{ id: number }>();
      if (!categoryExists) {
        return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'New category not found.' }), 400);
      }
    }

    // 3. Check for title uniqueness if title or category_id is changing
    const newTitle = updateData.title !== undefined ? updateData.title : existingSeries.title;
    const newCategoryId = updateData.category_id !== undefined ? updateData.category_id : existingSeries.category_id;

    if (updateData.title !== undefined || updateData.category_id !== undefined) {
      const conflictingSeries = await c.env.DB.prepare(
        'SELECT id FROM series WHERE title = ?1 AND category_id = ?2 AND id != ?3'
      ).bind(newTitle, newCategoryId, id).first<{ id: number }>();

      if (conflictingSeries) {
        return c.json(SeriesUpdateFailedErrorSchema.parse({ success: false, message: 'Series title already exists in this category for another series.' }), 400);
      }
    }

    // Slug generation and uniqueness check
    let finalSlug = updateData.slug;
    let slugIsBeingUpdated = false;

    if (updateData.slug !== undefined) {
      slugIsBeingUpdated = true;
      if (!updateData.slug || updateData.slug.startsWith('temp-slug-')) {
        let titleForSlug = updateData.title !== undefined ? updateData.title : existingSeries.title;
        const newGeneratedSlug = generateSlug(titleForSlug);
        finalSlug = newGeneratedSlug || `series-${id}-${Date.now()}`;
      } else {
        finalSlug = updateData.slug; // Use the provided, non-temporary slug
      }
    }

    // Check for slug uniqueness only if the slug is actually being changed to a new value
    if (slugIsBeingUpdated && finalSlug !== existingSeries.slug) {
      const conflictingSeriesBySlug = await c.env.DB.prepare(
        'SELECT id FROM series WHERE slug = ?1 AND category_id = ?2 AND id != ?3'
      ).bind(finalSlug, newCategoryId, id).first<{ id: number }>();

      if (conflictingSeriesBySlug) {
        return c.json(SeriesSlugExistsErrorSchema.parse({ 
            success: false, 
            message: 'Series slug already exists in this category for another series.' 
        }), 400);
      }
    }

    // 4. Build and execute update query
    const fieldsToUpdate: string[] = [];
    const bindings: (string | number | null)[] = [];
    let bindingIndex = 1;

    if (updateData.title !== undefined) {
      fieldsToUpdate.push(`title = ?${bindingIndex}`);
      bindings.push(updateData.title);
      bindingIndex++;
    }
    if (updateData.description !== undefined) {
      fieldsToUpdate.push(`description = ?${bindingIndex}`);
      bindings.push(updateData.description);
      bindingIndex++;
    }
    if (updateData.category_id !== undefined) {
      fieldsToUpdate.push(`category_id = ?${bindingIndex}`);
      bindings.push(updateData.category_id);
      bindingIndex++;
    }
    if (slugIsBeingUpdated && typeof finalSlug === 'string') { // Ensure finalSlug is a string before pushing
      fieldsToUpdate.push(`slug = ?${bindingIndex}`);
      bindings.push(finalSlug);
      bindingIndex++;
    } else if (slugIsBeingUpdated && finalSlug === null) {
      // If the intent is to set slug to NULL (if schema allowed and DB allowed)
      // fieldsToUpdate.push(`slug = ?${bindingIndex}`);
      // bindings.push(null);
      // bindingIndex++;
      // For now, we assume a slug should always be a string if updated.
      // If finalSlug is not a string here but slugIsBeingUpdated is true, it's an unexpected state.
      // However, current logic should ensure finalSlug is a string if slugIsBeingUpdated is true.
      // This explicit check satisfies TypeScript.
    }

    if (fieldsToUpdate.length === 0) {
      return c.json(SeriesUpdateResponseSchema.parse({ success: true, message: 'Series updated successfully.' }), 200);
    }

    fieldsToUpdate.push(`updated_at = CURRENT_TIMESTAMP`);
    bindings.push(id);

    const query = `UPDATE series SET ${fieldsToUpdate.join(', ')} WHERE id = ?${bindingIndex}`;
    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const result = await stmt.run();

    if (result.success) {
      return c.json(SeriesUpdateResponseSchema.parse({ success: true, message: 'Series updated successfully.' }), 200);
    } else {
      console.error('Failed to update series, D1 result:', result);
      return c.json(SeriesUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update series.' }), 500);
    }

  } catch (error) {
    console.error('Error updating series:', error);
    if (error instanceof Error && 
        (error.message.includes('UNIQUE constraint failed: series.category_id, series.title') || 
         error.message.includes('UNIQUE constraint failed: series.slug, series.category_id'))) {
        return c.json(SeriesUpdateFailedErrorSchema.parse({ 
            success: false, 
            message: 'Series title or slug already exists in this category for another series.' 
        }), 400);
    }
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to update series due to a server error.' }), 500);
  }
};
