import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  CategoryUpdateRequestSchema,
  CategoryUpdateResponseSchema,
  CategoryNotFoundErrorSchema,
  CategoryNameExistsErrorSchema,
  CategoryUpdateFailedErrorSchema
} from '../../schemas/categorySchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

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
    // Check if category exists
    const categoryExists = await c.env.DB.prepare('SELECT id FROM categories WHERE id = ?1').bind(id).first<{ id: number }>();
    if (!categoryExists) {
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

    const fieldsToUpdate = { ...updateData, updated_at: new Date().toISOString() };
    const setClauses = Object.keys(fieldsToUpdate).map((key, index) => `${key} = ?${index + 1}`);
    const values = Object.values(fieldsToUpdate);

    const stmt = c.env.DB.prepare(
      `UPDATE categories SET ${setClauses.join(', ')} WHERE id = ?${values.length + 1}`
    ).bind(...values, id);

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
