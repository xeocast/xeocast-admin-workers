import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  PodcastCreateRequestSchema,
  PodcastCreateResponseSchema,
  PodcastCreateFailedErrorSchema
} from '../../schemas/podcastSchemas';
import { GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

export const createPodcastHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = PodcastCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    console.error('Create podcast validation error:', validationResult.error.flatten());
    return c.json(PodcastCreateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for creating podcast.', 
        // errors: validationResult.error.flatten().fieldErrors // Optional 
    }), 400);
  }

  const { title, description, markdown_content, category_id, series_id, status, scheduled_publish_at } = validationResult.data;

  // Default status from schema is 'draft'. The DB schema has 'type' as NOT NULL, but it's not in PodcastBaseSchema.
  // Assuming 'type' needs to be handled or has a DB default. For now, it's omitted from INSERT.
  // This will likely fail if 'type' doesn't have a DB default and is not nullable.
  // The user should be informed about this missing 'type' field.

  try {
    // Validate category_id
    const category = await c.env.DB.prepare('SELECT id FROM categories WHERE id = ?1').bind(category_id).first<{ id: number }>();
    if (!category) {
      return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Invalid category_id: Category does not exist.' }), 400);
    }

    // Validate series_id if provided
    if (series_id) {
      const series = await c.env.DB.prepare('SELECT id, category_id FROM series WHERE id = ?1').bind(series_id).first<{ id: number; category_id: number }>();
      if (!series) {
        return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Invalid series_id: Series does not exist.' }), 400);
      }
      if (series.category_id !== category_id) {
        return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Series category_id does not match podcast category_id.' }), 400);
      }
    }
    
    // The 'podcasts' table has a NOT NULL 'type' column (checked from 0001_initial_schemas.sql)
    // This is not part of PodcastBaseSchema or PodcastCreateRequestSchema.
    // This INSERT will fail unless 'type' has a default value in the DB or is made nullable.
    // For now, I will add a placeholder 'evergreen' for type. This needs to be addressed by the USER.
    const podcastType = 'evergreen'; // Placeholder - USER MUST ADDRESS THIS

    const stmt = c.env.DB.prepare(
      `INSERT INTO podcasts (
        title, description, markdown_content, category_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, CURRENT_TIMESTAMP, ?8)`
    ).bind(
      title,
      description,
      markdown_content,
      category_id,
      series_id, // D1 handles null correctly for nullable INTEGER fields
      status,
      scheduled_publish_at, // D1 handles null correctly
      podcastType // Placeholder for type
    );
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(PodcastCreateResponseSchema.parse({
        success: true,
        message: 'Podcast created successfully.',
        podcastId: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert podcast, D1 result:', result);
      return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create podcast.' }), 500);
    }

  } catch (error: any) {
    console.error('Error creating podcast:', error);
    // Check for D1 specific errors, e.g., foreign key constraint (though D1 might not enforce them strictly)
    // Or unique constraint violations if any were applicable
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
        return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Invalid category_id or series_id.' }), 400);
    }
    if (error.message && error.message.includes('CHECK constraint failed: status')) {
        // This error highlights the status schema mismatch noted earlier.
        return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: `Invalid status value. Please check allowed statuses. Received: ${status}` }), 400);
    }
     if (error.message && error.message.includes('NOT NULL constraint failed: podcasts.type')) {
        return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Podcast type is required and was not provided.' }), 400);
    }
    return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create podcast due to a server error.' }), 500);
  }
};
