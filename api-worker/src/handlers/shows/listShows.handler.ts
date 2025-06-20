import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from 'zod';
import {
  ListShowsResponseSchema,
  ShowSummarySchema
} from '../../schemas/showSchemas';
import { GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const listShowsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, name, language_code, slug FROM shows ORDER BY id ASC'
    ).all<z.infer<typeof ShowSummarySchema>>();

    const shows = results ? results.map(row => ShowSummarySchema.parse(row)) : [];

    return c.json(ListShowsResponseSchema.parse({
      
      shows: shows
    }), 200);

  } catch (error) {
    console.error('Error listing shows:', error);
    return c.json(GeneralServerErrorSchema.parse({
                message: 'Failed to retrieve shows.'
    }), 500);
  }
};
