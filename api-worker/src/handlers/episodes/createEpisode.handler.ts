import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeCreateRequestSchema,
  EpisodeCreateResponseSchema,
  EpisodeCreateFailedErrorSchema,
  EpisodeSlugExistsErrorSchema
} from '../../schemas/episodeSchemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';
import { generateSlug, ensureUniqueSlug } from '../../utils/slugify';

export const createEpisodeHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(EpisodeCreateFailedErrorSchema.parse({ success: false, message: 'Failed to create episode.' }), 400);
  }

  const validationResult = EpisodeCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(EpisodeCreateFailedErrorSchema.parse({ 
      success: false, 
      message: 'Failed to create episode.'
    }), 400);
  }

  const { 
    title, 
    show_id, 
    series_id = null,
    description, 
    markdown_content,
    type,
    status = 'draft',
    tags = '[]',
    script = '[]',
    first_comment = null,
    audio_bucket_key = null,
    background_bucket_key = null,
    background_music_bucket_key = null,
    intro_music_bucket_key = null,
    video_bucket_key = null,
    thumbnail_bucket_key = null,
    article_image_bucket_key = null,
    thumbnail_gen_prompt = null,
    article_image_gen_prompt = null,
    scheduled_publish_at = null,
    status_on_youtube = null,
    status_on_website = null,
    status_on_x = null,
    freezeStatus = true
  } = validationResult.data;
  
  let slug = validationResult.data.slug;

  if (!slug || slug.startsWith('temp-slug-')) {
    const newSlug = generateSlug(title);
    slug = newSlug || `episode-${Date.now()}`; // Fallback if title results in an empty slug
  }

  try {
    // 1. Validate show_id
    const showExists = await c.env.DB.prepare('SELECT id FROM shows WHERE id = ?1')
      .bind(show_id)
      .first<{ id: number }>();

    if (!showExists) {
      return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Show not found.' }), 400);
    }

    // 2. Validate series_id if provided
    if (series_id !== null) {
      const seriesExists = await c.env.DB.prepare('SELECT id, show_id FROM series WHERE id = ?1')
        .bind(series_id)
        .first<{ id: number, show_id: number }>();

      if (!seriesExists) {
        return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Series not found.' }), 400);
      }

      // Ensure the series belongs to the specified show
      if (seriesExists.show_id !== show_id) {
        return c.json(GeneralBadRequestErrorSchema.parse({ 
          success: false, 
          message: 'The specified series does not belong to the specified show.' 
        }), 400);
      }
    }

    // 3. Check if episode slug already exists
    const existingEpisode = await c.env.DB.prepare('SELECT id FROM episodes WHERE slug = ?1')
      .bind(slug)
      .first<{ id: number }>();

    if (existingEpisode) {
      return c.json(EpisodeSlugExistsErrorSchema.parse({ 
        success: false, 
        message: 'Episode slug already exists in this series.' 
      }), 400);
    }

    // Ensure the slug is unique
    slug = await ensureUniqueSlug(c.env.DB, slug, 'episodes', 'slug', 'id');

    // 4. Store episode in the database
    const stmt = c.env.DB.prepare(`
      INSERT INTO episodes (
        title, slug, description, markdown_content, show_id, series_id, status, 
        tags, type, first_comment, script, audio_bucket_key, background_bucket_key, 
        background_music_bucket_key, intro_music_bucket_key, video_bucket_key, 
        thumbnail_bucket_key, article_image_bucket_key, thumbnail_gen_prompt, 
        article_image_gen_prompt, scheduled_publish_at, status_on_youtube, 
        status_on_website, status_on_x, freezeStatus
      ) VALUES (
        ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, 
        ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24, ?25
      )
    `).bind(
      title, slug, description, markdown_content, show_id, series_id, status,
      tags, type, first_comment, script, audio_bucket_key, background_bucket_key,
      background_music_bucket_key, intro_music_bucket_key, video_bucket_key,
      thumbnail_bucket_key, article_image_bucket_key, thumbnail_gen_prompt,
      article_image_gen_prompt, scheduled_publish_at, status_on_youtube,
      status_on_website, status_on_x, freezeStatus
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
      return c.json(EpisodeCreateFailedErrorSchema.parse({ 
        success: false, 
        message: 'Failed to create episode.' 
      }), 500);
    }

  } catch (error) {
    console.error('Error creating episode:', error);
    // Check for unique constraint violation error
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed: episodes.slug')) {
        return c.json(EpisodeSlugExistsErrorSchema.parse({ 
          success: false, 
          message: 'Episode slug already exists in this series.' 
        }), 400);
      }
    }
    return c.json(GeneralServerErrorSchema.parse({ 
      success: false, 
      message: 'Failed to create episode due to a server error.' 
    }), 500);
  }
};