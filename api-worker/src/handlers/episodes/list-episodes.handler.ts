import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi';

import {
  EpisodeSchema,
  EpisodeListItemSchema,
  ListEpisodesQuerySchema,
  ListEpisodesResponseSchema,
  EpisodeSortBySchema,
} from '../../schemas/episode.schemas';
import {
  GeneralServerErrorSchema,
  GeneralBadRequestErrorSchema,
} from '../../schemas/common.schemas';

const snakeToCamel = (s: string) => s.replace(/(_\w)/g, k => k[1].toUpperCase());

export const listEpisodesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListEpisodesQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
      message: 'Invalid query parameters.', 
      errors: queryParseResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { page, limit, status, showId, seriesId, title, type, sortBy, sortOrder } = queryParseResult.data;
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let bindings: (string | number)[] = [];
  let paramIndex = 1;

  if (status) {
    whereClauses.push(`status = ?${paramIndex++}`);
    bindings.push(status);
  }
  if (showId) {
    whereClauses.push(`show_id = ?${paramIndex++}`);
    bindings.push(showId);
  }
  if (seriesId) {
    whereClauses.push(`series_id = ?${paramIndex++}`);
    bindings.push(seriesId);
  }
  if (title) {
    whereClauses.push(`LOWER(title) LIKE LOWER(?${paramIndex++})`);
    bindings.push(`%${title}%`);
  }
  if (type) {
    whereClauses.push(`type = ?${paramIndex++}`);
    bindings.push(type);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const validSortColumns: Record<z.infer<typeof EpisodeSortBySchema>, string> = {
    id: 'id',
    title: 'title',
    status: 'status',
    type: 'type',
    showId: 'show_id',
    seriesId: 'series_id',
    scheduledPublishAt: 'scheduled_publish_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  const orderByColumn = validSortColumns[sortBy] || 'created_at';
  const orderByDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const orderByString = `ORDER BY ${orderByColumn} ${orderByDirection}`;

  try {
    const episodesQuery = c.env.DB.prepare(
      `SELECT 
        id, title, slug, description, markdown_content, show_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags, created_at, updated_at, 
        audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key, 
        video_bucket_key, thumbnail_bucket_key, article_image_bucket_key,
        script, thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freeze_status, first_comment
      FROM episodes ${whereString} ${orderByString} LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`
    ).bind(...bindings, limit, offset);
    
    const countQuery = c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM episodes ${whereString}`
    ).bind(...bindings);

    const [episodesDbResult, countResult] = await Promise.all([
      episodesQuery.all(), 
      countQuery.first<{ total: number }>()
    ]);

    if (!episodesDbResult.results || countResult === null) {
        console.error('Failed to fetch episodes or count, D1 results:', episodesDbResult, countResult);
        return c.json(GeneralServerErrorSchema.parse({ 
          message: 'Failed to retrieve episodes from the database.'
        }), 500);
    }

    const processedEpisodes = episodesDbResult.results.map((dbEpisode: any) => {
      const camelCaseEpisode = Object.fromEntries(
        Object.entries(dbEpisode).map(([key, value]) => [snakeToCamel(key), value])
      );
      const parsedEpisode = EpisodeSchema.safeParse(camelCaseEpisode);
      if (!parsedEpisode.success) {
        console.error(`Error parsing episode ID ${dbEpisode.id} in list:`, parsedEpisode.error.flatten());
      }
      return parsedEpisode.success ? parsedEpisode.data : null;
    }).filter(Boolean);

    const validatedEpisodesList = z.array(EpisodeListItemSchema).safeParse(processedEpisodes);

    if (!validatedEpisodesList.success) {
        console.error('Final episode list validation error:', validatedEpisodesList.error.flatten());
        return c.json(GeneralServerErrorSchema.parse({ 
          message: 'Error validating final episode list structure.'
        }), 500);
    }

    const totalItems = countResult!.total; 
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return c.json(ListEpisodesResponseSchema.parse({
      episodes: validatedEpisodesList.data,
      pagination: pagination,
    }), 200);

  } catch (error) {
    console.error('Error listing episodes:', error);
    return c.json(GeneralServerErrorSchema.parse({ 
      message: 'Failed to list episodes due to a server error.' 
    }), 500);
  }
};