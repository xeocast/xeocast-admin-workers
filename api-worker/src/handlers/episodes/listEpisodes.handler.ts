import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi';

// Define the type for raw database episode data using the imported Zod schema
type RawDbEpisode = z.infer<typeof EpisodeDbSchema>;
import {
  EpisodeSchema,
  EpisodeListItemSchema,
  ListEpisodesQuerySchema,
  ListEpisodesResponseSchema,
  EpisodeDbSchema,
  EpisodeSortBySchema, // Import for validation
  SortOrderSchema, // Import for validation
} from '../../schemas/episodeSchemas';
import {
  GeneralServerErrorSchema,
  GeneralBadRequestErrorSchema,
} from '../../schemas/commonSchemas';

// Define the type for raw database episode data
type DbEpisode = z.infer<typeof EpisodeDbSchema>;

export const listEpisodesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListEpisodesQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
      message: 'Invalid query parameters.', 
      errors: queryParseResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { page, limit, status, show_id, series_id, title, type, sortBy, sortOrder } = queryParseResult.data;
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let bindings: (string | number)[] = [];
  let paramIndex = 1;

  if (status) {
    whereClauses.push(`status = ?${paramIndex++}`);
    bindings.push(status);
  }
  if (show_id) {
    whereClauses.push(`show_id = ?${paramIndex++}`);
    bindings.push(show_id);
  }
  if (series_id) {
    whereClauses.push(`series_id = ?${paramIndex++}`);
    bindings.push(series_id);
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

  // Whitelist of sortable columns and their actual DB names
  const validSortColumns: Record<z.infer<typeof EpisodeSortBySchema>, string> = {
    id: 'id',
    title: 'title',
    status: 'status',
    type: 'type',
    show_id: 'show_id',
    series_id: 'series_id',
    scheduled_publish_at: 'scheduled_publish_at',
    created_at: 'created_at',
    updated_at: 'updated_at',
  };

  const orderByColumn = validSortColumns[sortBy] || 'created_at'; // Default to 'created_at' if invalid sortBy
  const orderByDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'; // Default to DESC if invalid sortOrder (though schema validates)

  const orderByString = `ORDER BY ${orderByColumn} ${orderByDirection}`;

  try {
    // Select all fields required by EpisodeDbSchema for transformation by EpisodeSchema
    const episodesQuery = c.env.DB.prepare(
      `SELECT 
        id, title, slug, description, markdown_content, show_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags, created_at, updated_at, 
        audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key, 
        video_bucket_key, thumbnail_bucket_key, article_image_bucket_key,
        script, thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freezeStatus, first_comment
      FROM episodes ${whereString} ${orderByString} LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`
    ).bind(...bindings, limit, offset);
    
    const countQuery = c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM episodes ${whereString}`
    ).bind(...bindings);

    const [episodesDbResult, countResult] = await Promise.all([
      episodesQuery.all<RawDbEpisode>(), 
      countQuery.first<{ total: number }>()
    ]);

    if (!episodesDbResult.results || countResult === null) {
        console.error('Failed to fetch episodes or count, D1 results:', episodesDbResult, countResult);
        return c.json(GeneralServerErrorSchema.parse({ 
          
          message: 'Failed to retrieve episodes from the database.'
        }), 500);
    }

    const processedEpisodes = episodesDbResult.results.map((dbEpisode: RawDbEpisode) => {
      const parsedEpisode = EpisodeSchema.safeParse(dbEpisode);
      if (!parsedEpisode.success) {
        console.error(`Error parsing episode ID ${dbEpisode.id} in list:`, parsedEpisode.error.flatten());
        // Potentially skip this episode or handle error. For now, we'll let it be filtered out by validatedEpisodesList if it's problematic.
        // Or, more strictly:
        // return null; 
        // And then filter(Boolean) before passing to EpisodeListItemSchema.array().safeParse()
        // However, EpisodeListItemSchema picks from EpisodeSchema's output, so a failure here means it won't conform.
      }
      return parsedEpisode.success ? parsedEpisode.data : null; // Return null if parsing failed
    }).filter(Boolean); // Filter out any nulls from parsing errors

    // Validate the array of processed episodes against z.array(EpisodeListItemSchema)
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