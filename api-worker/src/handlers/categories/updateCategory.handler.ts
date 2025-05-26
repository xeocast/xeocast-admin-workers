import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  CategoryUpdateRequestSchema,
  CategoryUpdateResponseSchema,
  CategoryNotFoundErrorSchema,
  CategoryNameExistsErrorSchema,
  CategorySlugExistsErrorSchema,
  CategoryUpdateFailedErrorSchema
} from '../../schemas/categorySchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';
import { generateSlug } from '../../utils/slugify';

interface ExistingCategory {
  id: number;
  name: string;
  slug: string | null;
}

export const updateCategoryHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(CategoryUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = CategoryUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    console.error('Update category validation error:', validationResult.error.flatten());
    return c.json(CategoryUpdateFailedErrorSchema.parse({ success: false, message: 'Invalid input for updating category.' }), 400);
  }

  const updateData = validationResult.data;

  if (Object.keys(updateData).length === 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'No update data provided.' }), 400);
  }

  try {
    // Check if category exists and get its current name and slug
    const existingCategory = await c.env.DB.prepare('SELECT id, name, slug FROM categories WHERE id = ?1').bind(id).first<ExistingCategory>();
    if (!existingCategory) {
      return c.json(CategoryNotFoundErrorSchema.parse({ success: false, message: 'Category not found.' }), 404);
    }

    // If name is being updated, check for conflicts
    if (updateData.name) {
      const existingCategoryWithName = await c.env.DB.prepare(
        'SELECT id FROM categories WHERE name = ?1 AND id != ?2'
      ).bind(updateData.name, id).first<{ id: number }>();

      if (existingCategoryWithName) {
        return c.json(CategoryNameExistsErrorSchema.parse({ success: false, message: 'Category name already exists.' }), 400);
      }
    }

    // Slug generation logic
    let finalSlug = updateData.slug;
    let slugIsBeingUpdated = false;

    if (updateData.slug !== undefined) {
      slugIsBeingUpdated = true;
      if (!updateData.slug || updateData.slug.startsWith('temp-slug-')) {
        const nameForSlugGeneration = updateData.name ?? existingCategory.name;
        const newGeneratedSlug = generateSlug(nameForSlugGeneration);
        finalSlug = newGeneratedSlug || `category-${id}-${Date.now()}`;
      } else {
        finalSlug = updateData.slug; // Use the provided, non-temporary slug
      }
    }

    // If slug is being updated, check for conflicts
    if (slugIsBeingUpdated && finalSlug !== existingCategory.slug) {
      const existingCategoryWithSlug = await c.env.DB.prepare(
        'SELECT id FROM categories WHERE slug = ?1 AND id != ?2'
      ).bind(finalSlug, id).first<{ id: number }>();

      if (existingCategoryWithSlug) {
        return c.json(CategorySlugExistsErrorSchema.parse({ 
          success: false, 
          message: 'Category slug already exists.' 
        }), 400);
      }
    }

    const setClauses: string[] = [];
    const bindings: any[] = [];
    let paramIndex = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      if (key === 'slug') return; // Handled separately by finalSlug
      if (value !== undefined) {
        setClauses.push(`${key} = ?${paramIndex++}`);
        bindings.push(value);
      }
    });

    if (slugIsBeingUpdated && typeof finalSlug === 'string') {
      setClauses.push(`slug = ?${paramIndex++}`);
      bindings.push(finalSlug);
    } else if (slugIsBeingUpdated && finalSlug === null) {
      // If schema allows setting slug to null explicitly
      // setClauses.push(`slug = ?${paramIndex++}`);
      // bindings.push(null);
    }

    if (setClauses.length === 0) {
      // No actual data fields to update (e.g., only slug was provided but it resulted in no change, or empty payload)
      // However, the initial check for Object.keys(updateData).length === 0 should catch empty payloads.
      // If slug was the only field and it didn't change, this path might be hit.
      return c.json(CategoryUpdateResponseSchema.parse({ success: true, message: 'No effective changes to apply.' }), 200);
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`); // Always update timestamp

    bindings.push(id); // For the WHERE clause
    const stmt = c.env.DB.prepare(
      `UPDATE categories SET ${setClauses.join(', ')} WHERE id = ?${paramIndex}`
    ).bind(...bindings);

    const result = await stmt.run();

    if (result.success) {
        // D1's run() result for UPDATE doesn't directly confirm a row was changed if values were same.
        // It indicates the query executed. We assume success if no error.
        return c.json(CategoryUpdateResponseSchema.parse({ success: true, message: 'Category updated successfully.' }), 200);
    } else {
      console.error('Failed to update category, D1 result:', result);
      return c.json(CategoryUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update category.' }), 500);
    }

  } catch (error) {
    console.error('Error updating category:', error);
    return c.json(CategoryUpdateFailedErrorSchema.parse({ success: false, message: 'Failed to update category.' }), 500);
  }
};
