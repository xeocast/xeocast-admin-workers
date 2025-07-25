import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  SeriesCreateRequestSchema,
  SeriesCreateResponseSchema,
  SeriesSlugExistsErrorSchema,
  SeriesCreateFailedErrorSchema
} from '../../schemas/series.schemas';
import { GeneralBadRequestErrorSchema } from '../../schemas/common.schemas'; // For show not found
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

export const createSeriesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch {
    return c.json(SeriesCreateFailedErrorSchema.parse({ message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = SeriesCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(SeriesCreateFailedErrorSchema.parse({ 
        message: 'Invalid input for creating series.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { title, showId } = validationResult.data;
  let slug = validationResult.data.slug;
  const description = validationResult.data.description ?? null;

  if (!slug || slug.startsWith('temp-slug-')) {
    const newSlug = generateSlug(title);
    slug = newSlug || `series-${Date.now()}`; // Fallback if title results in an empty slug
  }


  try {
    // 1. Validate showId
    const showExists = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1')
      .bind(showId)
      .first<{ id: number }>();

    if (!showExists) {
      return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Show not found.' }), 400);
    }

    // 2. Check if series title already exists within the same showId
    const existingSeries = await c.env.DB.prepare('SELECT id FROM series WHERE title = ?1 AND show_id = ?2')
      .bind(title, showId)
      .first<{ id: number }>();

    if (existingSeries) {
      return c.json(SeriesCreateFailedErrorSchema.parse({ message: 'Series title already exists in this show.' }), 400);
    }

    // Ensure the slug is unique
    const finalSlug = await ensureUniqueSlug(c.env.DB, slug, 'series', 'slug', 'id');

    // 3. Store series in the database
    const stmt = c.env.DB.prepare(
      'INSERT INTO series (title, slug, description, show_id) VALUES (?1, ?2, ?3, ?4)'
    ).bind(title, finalSlug, description, showId);
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(SeriesCreateResponseSchema.parse({
        message: 'Series created successfully.',
        id: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert series, D1 result:', result);
      // This could be a D1 error or the unique constraint (showId, title) if not caught above (race condition, though unlikely here)
      return c.json(SeriesCreateFailedErrorSchema.parse({ message: 'Failed to create series.' }), 500);
    }

  } catch (error) {
    console.error('Error creating series:', error);
    // Check for unique constraint violation error (specific to D1/SQLite syntax if possible)
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed: series.slug')) {
        return c.json(SeriesSlugExistsErrorSchema.parse({ message: 'Series slug already exists.' }), 400);
      }
      if (error.message.includes('UNIQUE constraint failed: series.title')) { // Assuming you might have a unique constraint on (title, showId) or similar for title
        return c.json(SeriesCreateFailedErrorSchema.parse({ message: 'Series title already exists in this show.' }), 400);
      }
    }
    return c.json(SeriesCreateFailedErrorSchema.parse({ message: 'Failed to create series due to a server error.' }), 500);
  }
};
