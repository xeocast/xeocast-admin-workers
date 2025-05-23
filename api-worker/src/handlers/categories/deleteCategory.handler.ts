import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  CategoryDeleteResponseSchema,
  CategoryNotFoundErrorSchema,
  CategoryDeleteFailedErrorSchema
} from '../../schemas/categorySchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

export const deleteCategoryHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    // Check if category exists
    const categoryExists = await c.env.DB.prepare('SELECT id FROM categories WHERE id = ?1').bind(id).first<{ id: number }>();
    if (!categoryExists) {
      return c.json(CategoryNotFoundErrorSchema.parse({ success: false, message: 'Category not found.' }), 404);
    }

    // Check for dependencies: podcasts
    const dependentPodcasts = await c.env.DB.prepare('SELECT id FROM podcasts WHERE category_id = ?1 LIMIT 1').bind(id).first<{ id: number }>();
    if (dependentPodcasts) {
      return c.json(CategoryDeleteFailedErrorSchema.parse({ success: false, message: 'Cannot delete category: It is referenced by existing podcasts.' }), 400);
    }

    // Check for dependencies: series
    const dependentSeries = await c.env.DB.prepare('SELECT id FROM series WHERE category_id = ?1 LIMIT 1').bind(id).first<{ id: number }>();
    if (dependentSeries) {
      return c.json(CategoryDeleteFailedErrorSchema.parse({ success: false, message: 'Cannot delete category: It is referenced by existing series.' }), 400);
    }
    
    // Check for dependencies: youtube_channels
    const dependentYouTubeChannels = await c.env.DB.prepare('SELECT id FROM youtube_channels WHERE category_id = ?1 LIMIT 1').bind(id).first<{ id: number }>();
    if (dependentYouTubeChannels) {
        return c.json(CategoryDeleteFailedErrorSchema.parse({ success: false, message: 'Cannot delete category: It is referenced by existing YouTube channels.' }), 400);
    }

    const stmt = c.env.DB.prepare('DELETE FROM categories WHERE id = ?1').bind(id);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(CategoryDeleteResponseSchema.parse({ success: true, message: 'Category deleted successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
        // This case should ideally be caught by the existence check, but as a safeguard:
        return c.json(CategoryNotFoundErrorSchema.parse({ success: false, message: 'Category not found or already deleted.' }), 404);
    }else {
      console.error('Failed to delete category, D1 result:', result);
      return c.json(CategoryDeleteFailedErrorSchema.parse({ success: false, message: 'Failed to delete category.' }), 500);
    }

  } catch (error) {
    console.error('Error deleting category:', error);
    // This could be a foreign key constraint error if not caught by manual checks, though D1 might not enforce them by default
    return c.json(CategoryDeleteFailedErrorSchema.parse({ success: false, message: 'Failed to delete category due to an unexpected error.' }), 500);
  }
};
