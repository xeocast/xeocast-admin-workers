import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  PodcastCreateRequestSchema,
  PodcastCreateResponseSchema,
  PodcastSlugExistsErrorSchema,
  PodcastCreateFailedErrorSchema
} from '../../schemas/podcastSchemas';
import { GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

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

  const { 
    title, description, markdown_content, category_id, series_id, status, scheduled_publish_at, tags, type, 
    // New fields from schema
    script, source_background_music_bucket_key, source_intro_music_bucket_key, 
    thumbnail_gen_prompt, article_image_gen_prompt, 
    status_on_youtube, status_on_website, status_on_x, freezeStatus 
  } = validationResult.data;
  let slug = validationResult.data.slug;

  if (!slug || slug.startsWith('temp-slug-')) {
    const newSlug = generateSlug(title);
    slug = newSlug || `podcast-${Date.now()}`; // Fallback if title results in an empty slug
  }

  // Prepare additional conditions for slug uniqueness based on series_id
  const slugUniqueConditions: Record<string, any> = {};
  if (series_id) {
    slugUniqueConditions.series_id = series_id;
  } else {
    // For podcasts not in a series, their slugs must be unique among other non-series podcasts
    slugUniqueConditions.series_id = null; 
  }

  // Default status from schema is 'draft'. The DB schema has 'type' as NOT NULL.
  // Prepare tags for database insertion
  const tagsForDB = tags ? JSON.stringify(tags) : '[]';
  
  // Prepare script for database insertion (DB default is '[]', NOT NULL, json_valid)
  // Use the raw 'script' from validationResult.data to check its type accurately
  const rawScript = validationResult.data.script;
  const scriptForDB = (typeof rawScript === 'string' && rawScript.trim() !== '') 
                        ? rawScript 
                        : '[]';

  // freezeStatus default in DB is TRUE. If not a boolean in request, use true.
  const rawFreezeStatus = validationResult.data.freezeStatus;
  const freezeStatusForDB = typeof rawFreezeStatus === 'boolean' 
                              ? rawFreezeStatus 
                              : true;

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
    // Ensure the slug is unique based on the conditions
    slug = await ensureUniqueSlug(c.env.DB, slug, 'podcasts', 'slug', 'id', undefined, slugUniqueConditions);

    
    const stmt = c.env.DB.prepare(
      `INSERT INTO podcasts (
        title, slug, description, markdown_content, category_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags,
        -- New fields from migration 0013
        script, source_background_music_bucket_key, source_intro_music_bucket_key,
        thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freezeStatus
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, CURRENT_TIMESTAMP, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19)`
    ).bind(
      title,                            //1
      slug,                             //2
      description,                      //3
      markdown_content,                 //4
      category_id,                      //5
      series_id,                        //6 D1 handles null correctly for nullable INTEGER fields
      status,                           //7
      scheduled_publish_at,             //8 D1 handles null correctly
      type,                             //9 Use type from validated data
      tagsForDB,                        //10
      // New fields
      scriptForDB,                      //11
      source_background_music_bucket_key, //12
      source_intro_music_bucket_key,    //13
      thumbnail_gen_prompt,             //14
      article_image_gen_prompt,         //15
      status_on_youtube,                //16
      status_on_website,                //17
      status_on_x,                      //18
      freezeStatusForDB                 //19
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
    // Check for slug unique constraint (adjust based on actual D1 error message if different)
    if (error.message && (error.message.includes('UNIQUE constraint failed: podcasts.slug, podcasts.series_id') || error.message.includes('UNIQUE constraint failed: podcasts.slug'))) { // D1 might have different messages for NULL series_id cases
        return c.json(PodcastSlugExistsErrorSchema.parse({ 
            success: false, 
            message: 'Podcast slug already exists.'
        }), 400);
    }
     if (error.message && error.message.includes('NOT NULL constraint failed: podcasts.type')) {
        return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Podcast type is required and was not provided.' }), 400);
    }
    return c.json(PodcastCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create podcast due to a server error.' }), 500);
  }
};
