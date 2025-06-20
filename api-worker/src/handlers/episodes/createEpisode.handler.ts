import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeCreateRequestSchema,
  EpisodeCreateResponseSchema,
  EpisodeCreateFailedErrorSchema,
  EpisodeSlugExistsErrorSchema
} from '../../schemas/episodeSchemas';
import { generateSlug } from '../../utils/slugify'; // Assuming this utility exists

export const createEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const body = await c.req.json();
  const parseResult = EpisodeCreateRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json(EpisodeCreateFailedErrorSchema.parse({
      message: 'Invalid request body.',
      errors: parseResult.error.flatten().fieldErrors,
    }), 400);
  }

  const { title, show_id, series_id } = parseResult.data;
  let slug = parseResult.data.slug;

  // Generate slug if not provided or if it's just whitespace
  if (!slug || slug.trim() === '') {
    slug = generateSlug(title);
  }

  // Check if slug is unique for the given show_id and series_id (if series_id is present)
  try {
    let slugCheckQuery;
    if (series_id) {
      slugCheckQuery = c.env.DB.prepare('SELECT id FROM episodes WHERE slug = ?1 AND show_id = ?2 AND series_id = ?3').bind(slug, show_id, series_id);
    } else {
      // If no series_id, check slug uniqueness only within the show (where series_id IS NULL)
      slugCheckQuery = c.env.DB.prepare('SELECT id FROM episodes WHERE slug = ?1 AND show_id = ?2 AND series_id IS NULL').bind(slug, show_id);
    }
    const existingEpisode = await slugCheckQuery.first();

    if (existingEpisode) {
      return c.json(EpisodeSlugExistsErrorSchema.parse({
                message: 'Episode slug already exists for this show/series combination.',
      }), 400);
    }
  } catch (dbError) {
    console.error('Error checking for existing slug:', dbError);
    return c.json(EpisodeCreateFailedErrorSchema.parse({
            message: 'Database error while checking for existing slug.',
    }), 500);
  }

  const episodeData = { ...parseResult.data, slug }; // Use the (potentially generated) slug

  try {
    const statement = c.env.DB.prepare(
      'INSERT INTO episodes (show_id, series_id, title, slug, description, markdown_content, tags, type, first_comment, script, audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key, video_bucket_key, thumbnail_bucket_key, article_image_bucket_key, thumbnail_gen_prompt, article_image_gen_prompt, scheduled_publish_at, status_on_youtube, status_on_website, status_on_x, freezeStatus, status, last_status_change_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24, ?25, CURRENT_TIMESTAMP)'
    ).bind(
      episodeData.show_id,
      episodeData.series_id ?? null,
      episodeData.title,
      episodeData.slug,
      episodeData.description,
      episodeData.markdown_content,
      episodeData.tags ?? '[]',
      episodeData.type,
      episodeData.first_comment ?? null,
      episodeData.script ?? '[]',
      episodeData.audio_bucket_key ?? null,
      episodeData.background_bucket_key ?? null,
      episodeData.background_music_bucket_key ?? null,
      episodeData.intro_music_bucket_key ?? null,
      episodeData.video_bucket_key ?? null,
      episodeData.thumbnail_bucket_key ?? null,
      episodeData.article_image_bucket_key ?? null,
      episodeData.thumbnail_gen_prompt ?? null,
      episodeData.article_image_gen_prompt ?? null,
      episodeData.scheduled_publish_at ?? null,
      episodeData.status_on_youtube ?? null,
      episodeData.status_on_website ?? null,
      episodeData.status_on_x ?? null,
      episodeData.freezeStatus === undefined ? 1 : (episodeData.freezeStatus ? 1 : 0), // Convert boolean to 0/1 for SQLite
      episodeData.status ?? 'draft'
    );
    const result = await statement.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(EpisodeCreateResponseSchema.parse({
        message: 'Episode created successfully.',
        episodeId: result.meta.last_row_id,
      }), 201);
    } else {
      console.error('Failed to insert episode, D1 result:', result);
      return c.json(EpisodeCreateFailedErrorSchema.parse({
                message: 'Failed to save episode to the database.',
      }), 500);
    }
  } catch (error) {
    console.error('Error creating episode:', error);
    return c.json(EpisodeCreateFailedErrorSchema.parse({
            message: 'An unexpected error occurred while creating the episode.',
    }), 500);
  }
};