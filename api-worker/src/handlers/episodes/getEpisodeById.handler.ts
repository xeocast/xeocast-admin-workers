import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeSchema,
  GetEpisodeResponseSchema,
  EpisodeNotFoundErrorSchema
} from '../../schemas/episodeSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const getEpisodeByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    // Select all fields defined in EpisodeDbSchema (which EpisodeSchema is based on)
    const episodeDataFromDB = await c.env.DB.prepare(`
      SELECT 
        id, title, slug, description, markdown_content, show_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags, created_at, updated_at, 
        audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key, 
        video_bucket_key, thumbnail_bucket_key, article_image_bucket_key,
        script, thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freezeStatus, first_comment
        -- duration_seconds is not in EpisodeSchema, user_id is also not part of it.
      FROM episodes WHERE id = ?1
    `).bind(id).first<any>(); // D1 returns fields that are NULL in DB as null in the object

    if (!episodeDataFromDB) {
      return c.json(EpisodeNotFoundErrorSchema.parse({ success: false, message: 'Episode not found.' }), 404);
    }

    // Validate the fetched data against the EpisodeSchema.
    // EpisodeSchema's transform handles parsing of JSON strings (tags, script) 
    // and coercion of date strings to Date objects.
    const validatedEpisode = EpisodeSchema.safeParse(episodeDataFromDB);
    if (!validatedEpisode.success) {
      console.error('Episode data validation error after fetching from DB (getById):', validatedEpisode.error.flatten());
      // This indicates a mismatch between DB schema and Zod schema, or bad data in DB
      return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error validating episode data from database.'}), 500);
    }

    return c.json(GetEpisodeResponseSchema.parse({ success: true, episode: validatedEpisode.data }), 200);

  } catch (error) {
    console.error('Error fetching episode by ID:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to fetch episode due to a server error.' }), 500);
  }
};
