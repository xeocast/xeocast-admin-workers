import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeCreateRequestSchema,
  EpisodeCreateResponseSchema,
  EpisodeSlugExistsErrorSchema,
  EpisodeCreateFailedErrorSchema
} from '../../schemas/episodeSchemas';
import { GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

export const createEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = EpisodeCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    console.error('Create episode validation error:', validationResult.error.flatten());
    return c.json(EpisodeCreateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for creating episode.', 
        // errors: validationResult.error.flatten().fieldErrors // Optional 
    }), 400);
  }

  const { 
    title, description, markdown_content, show_id, series_id, status, scheduled_publish_at, tags, type, 
    // New fields from schema
    script, 
    audio_bucket_key, // New
    background_bucket_key, // New
    background_music_bucket_key, // Corrected name
    intro_music_bucket_key, // Corrected name
    video_bucket_key, // New
    thumbnail_bucket_key, // New
    article_image_bucket_key, // New
    thumbnail_gen_prompt, 
    article_image_gen_prompt, 
    status_on_youtube, status_on_website, status_on_x, freezeStatus, 
    first_comment // New
  } = validationResult.data;
  let slug = validationResult.data.slug;

  if (!slug || slug.startsWith('temp-slug-')) {
    const newSlug = generateSlug(title);
    slug = newSlug || `episode-${Date.now()}`; // Fallback if title results in an empty slug
  }

  // Prepare additional conditions for slug uniqueness based on series_id
  const slugUniqueConditions: Record<string, any> = {};
  if (series_id) {
    slugUniqueConditions.series_id = series_id;
  } else {
    // For episodes not in a series, their slugs must be unique among other non-series episodes
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
    // Validate show_id
    const show = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1').bind(show_id).first<{ id: number }>();
    if (!show) {
      return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Invalid show_id: Show does not exist.' }), 400);
    }

    // Validate series_id if provided
    if (series_id) {
      const series = await c.env.DB.prepare('SELECT id, show_id FROM series WHERE id = ?1').bind(series_id).first<{ id: number; show_id: number }>();
      if (!series) {
        return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Invalid series_id: Series does not exist.' }), 400);
      }
      if (series.show_id !== show_id) {
        return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Series show_id does not match episode show_id.' }), 400);
      }
    }
    // Ensure the slug is unique based on the conditions
    slug = await ensureUniqueSlug(c.env.DB, slug, 'episodes', 'slug', 'id', undefined, slugUniqueConditions);

    
    const stmt = c.env.DB.prepare(
      `INSERT INTO episodes (
        title, slug, description, markdown_content, show_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags, script, 
        audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key,
        video_bucket_key, thumbnail_bucket_key, article_image_bucket_key,
        thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freezeStatus, first_comment
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, CURRENT_TIMESTAMP, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24, ?25)`
    ).bind(
      title,                            //1
      slug,                             //2
      description,                      //3
      markdown_content,                 //4
      show_id,                          //5
      series_id,                        //6 D1 handles null correctly for nullable INTEGER fields
      status,                           //7
      scheduled_publish_at,             //8 D1 handles null correctly
      type,                             //9 Use type from validated data
      tagsForDB,                        //10
      scriptForDB,                      //11
      audio_bucket_key,                 //12
      background_bucket_key,            //13
      background_music_bucket_key,      //14 Corrected name
      intro_music_bucket_key,           //15 Corrected name
      video_bucket_key,                 //16
      thumbnail_bucket_key,             //17
      article_image_bucket_key,         //18
      thumbnail_gen_prompt,             //19
      article_image_gen_prompt,         //20
      status_on_youtube,                //21
      status_on_website,                //22
      status_on_x,                      //23
      freezeStatusForDB,                //24
      first_comment                     //25
    );
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(EpisodeCreateResponseSchema.parse({
        success: true,
        message: 'Episode created successfully.',
        episodeId: result.meta.last_row_id
      }), 201);
    } else {
      console.error('Failed to insert episode, D1 result:', result);
      return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create episode.' }), 500);
    }

  } catch (error: any) {
    console.error('Error creating episode:', error);
    // Check for D1 specific errors, e.g., foreign key constraint (though D1 might not enforce them strictly)
    // Or unique constraint violations if any were applicable
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
        return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Invalid show_id or series_id.' }), 400);
    }
    if (error.message && error.message.includes('CHECK constraint failed: status')) {
        // This error highlights the status schema mismatch noted earlier.
        return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: `Invalid status value. Please check allowed statuses. Received: ${status}` }), 400);
    }
    if (error.message && error.message.includes('NOT NULL constraint failed: episodes.type')) {
        return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Episode type is required and was not provided.' }), 400);
    }
    // Check for slug unique constraint (adjust based on actual D1 error message if different)
    if (error.message && (error.message.includes('UNIQUE constraint failed: episodes.slug, episodes.series_id') || error.message.includes('UNIQUE constraint failed: episodes.slug'))) { // D1 might have different messages for NULL series_id cases
        return c.json(EpisodeSlugExistsErrorSchema.parse({ 
            success: false, 
            message: 'Episode slug already exists.'
        }), 400);
    }
     if (error.message && error.message.includes('NOT NULL constraint failed: episodes.type')) {
        return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Episode type is required and was not provided.' }), 400);
    }
    return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create episode due to a server error.' }), 500);
  }
};
