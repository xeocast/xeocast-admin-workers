import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from 'zod';
import {
  ListCategoriesResponseSchema,
  CategorySummarySchema
} from '../../schemas/categorySchemas';
import { GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const listCategoriesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, name, language_code, slug FROM categories ORDER BY name ASC'
    ).all<z.infer<typeof CategorySummarySchema>>();

    const categories = results ? results.map(row => CategorySummarySchema.parse(row)) : [];

    return c.json(ListCategoriesResponseSchema.parse({
      success: true,
      categories: categories
    }), 200);

  } catch (error) {
    console.error('Error listing categories:', error);
    return c.json(GeneralServerErrorSchema.parse({
        success: false,
        message: 'Failed to retrieve categories.'
    }), 500);
  }
};
