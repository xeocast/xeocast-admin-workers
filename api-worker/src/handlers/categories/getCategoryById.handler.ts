import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  CategorySchema,
  GetCategoryResponseSchema,
  CategoryNotFoundErrorSchema
} from '../../schemas/categorySchemas';
import { PathIdParamSchema, GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';
import { z } from 'zod';

export const getCategoryByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({
        success: false,
        message: 'Invalid ID format.'
    }), 400);
  }

  const id = parseInt(paramValidation.data.id, 10);

  try {
    const categoryRaw = await c.env.DB.prepare(
      'SELECT * FROM categories WHERE id = ?1'
    ).bind(id).first<z.infer<typeof CategorySchema>>();

    if (!categoryRaw) {
      return c.json(CategoryNotFoundErrorSchema.parse({
        success: false,
        message: 'Category not found.'
      }), 404);
    }
    
    const category = CategorySchema.parse(categoryRaw);

    return c.json(GetCategoryResponseSchema.parse({
      success: true,
      category: category
    }), 200);

  } catch (error) {
    if (error instanceof z.ZodError) {
        console.error('Get category by ID validation error:', error.flatten());
        return c.json(GeneralServerErrorSchema.parse({
            success: false,
            message: 'Response validation failed for category data.'
        }), 500);
    }
    console.error('Error fetching category by ID:', error);
    return c.json(GeneralServerErrorSchema.parse({
        success: false,
        message: 'Failed to retrieve category.'
    }), 500);
  }
};
