import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  SeriesCreateRequestSchema,
  SeriesCreateResponseSchema,
  SeriesCreateFailedErrorSchema
} from '../../schemas/seriesSchemas';
import { GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas'; // For category not found

export const createSeriesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(SeriesCreateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = SeriesCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(SeriesCreateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for creating series.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { title, description, category_id, youtube_playlist_id } = validationResult.data;

  try {
    // 1. Validate category_id
    const categoryExists = await c.env.DB.prepare('SELECT id FROM categories WHERE id = ?1')
      .bind(category_id)
      .first<{ id: number }>();

    if (!categoryExists) {
      return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Category not found.' }), 400);
    }

    // 2. Check if series title already exists within the same category_id
    const existingSeries = await c.env.DB.prepare('SELECT id FROM series WHERE title = ?1 AND category_id = ?2')
      .bind(title, category_id)
      .first<{ id: number }>();

    if (existingSeries) {
      return c.json(SeriesCreateFailedErrorSchema.parse({ success: false, message: 'Series title already exists in this category.' }), 400);
    }

    // 3. Store series in the database
    const stmt = c.env.DB.prepare(
      'INSERT INTO series (title, description, category_id, youtube_playlist_id) VALUES (?1, ?2, ?3, ?4)'
    ).bind(title, description, category_id, youtube_playlist_id === undefined ? null : youtube_playlist_id);
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(SeriesCreateResponseSchema.parse({
        success: true,
        message: 'Series created successfully.',
        seriesId: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert series, D1 result:', result);
      // This could be a D1 error or the unique constraint (category_id, title) if not caught above (race condition, though unlikely here)
      return c.json(SeriesCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create series.' }), 500);
    }

  } catch (error) {
    console.error('Error creating series:', error);
    // Check for unique constraint violation error (specific to D1/SQLite syntax if possible)
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed: series.category_id, series.title')) {
        return c.json(SeriesCreateFailedErrorSchema.parse({ success: false, message: 'Series title already exists in this category.' }), 400);
    }
    return c.json(SeriesCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create series due to a server error.' }), 500);
  }
};
