import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeSchema,
  GetEpisodeResponseSchema,
  EpisodeNotFoundErrorSchema
} from '../../schemas/episode.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../../schemas/common.schemas';

export const getEpisodeByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramParseResult = PathIdParamSchema.safeParse(c.req.param());

  if (!paramParseResult.success) {
    // This case should ideally be caught by routing validation if PathIdParamSchema is used in createRoute
    return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Invalid episode ID format.' }), 400);
  }

  const { id } = paramParseResult.data;

  try {
    const dbEpisode = await c.env.DB.prepare(
      `SELECT 
        id, title, slug, description, markdown_content, show_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags, created_at, updated_at, 
        audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key, 
        video_bucket_key, thumbnail_bucket_key, article_image_bucket_key,
        script, thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freezeStatus, first_comment
      FROM episodes WHERE id = ?1`
    ).bind(id).first<any>();

    if (!dbEpisode) {
      return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Episode not found.' }), 404);
    }

    const parsedEpisode = EpisodeSchema.safeParse(dbEpisode);

    if (!parsedEpisode.success) {
      console.error(`Error parsing episode ID ${id} from DB:`, parsedEpisode.error.flatten());
      return c.json(GeneralServerErrorSchema.parse({
                message: 'Error processing episode data from database.',
      }), 500);
    }

    return c.json(GetEpisodeResponseSchema.parse({
      
      episode: parsedEpisode.data,
    }), 200);

  } catch (error) {
    console.error(`Error fetching episode by ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({
            message: 'Failed to retrieve episode due to a server error.',
    }), 500);
  }
};