import { Context } from 'hono';
import { z } from 'zod';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeSchema, // Added import
  EpisodeListItemSchema, 
  EpisodeStatusSchema,
  EpisodePublicationTypeSchema, // Use for 'evergreen'/'news' type filtering
  ListEpisodesResponseSchema
} from '../../schemas/episodeSchemas';
import { GeneralServerErrorSchema, GeneralBadRequestErrorSchema } from '../../schemas/commonSchemas';

// This schema should align with the one in `src/routes/episodes.ts`
const ListEpisodesQueryInternalSchema = z.object({
  page: z.string().optional().default('1').transform(val => parseInt(val, 10)).refine(val => val > 0, { message: 'Page must be positive' }),
  limit: z.string().optional().default('10').transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100, { message: 'Limit must be between 1 and 100' }),
  status: EpisodeStatusSchema.optional(),
  show_id: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || val > 0, { message: 'Show ID must be positive' }),
  series_id: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || val > 0, { message: 'Series ID must be positive' }),
  title: z.string().optional(), // Added for title filtering
  type: EpisodePublicationTypeSchema.optional() // Use for 'evergreen'/'news' type filtering
});

export const listEpisodesHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListEpisodesQueryInternalSchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid query parameters.', errors: queryParseResult.error.flatten().fieldErrors }), 400);
  }

  const { page, limit, status, show_id, series_id, title, type } = queryParseResult.data;
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
    whereClauses.push(`title LIKE ?${paramIndex++}`);
    bindings.push(`%${title}%`);
  }
  if (type) {
    whereClauses.push(`type = ?${paramIndex++}`);
    bindings.push(type);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  try {
    // Select all fields required by EpisodeSchema for transformation
    const episodesQuery = c.env.DB.prepare(
      `SELECT 
        id, title, slug, description, markdown_content, show_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags, created_at, updated_at, 
        audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key, 
        video_bucket_key, thumbnail_bucket_key, article_image_bucket_key,
        script, thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freezeStatus, first_comment
      FROM episodes ${whereString} ORDER BY created_at DESC LIMIT ?${paramIndex++} OFFSET ?${paramIndex++}`
    ).bind(...bindings, limit, offset);
    
    const countQuery = c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM episodes ${whereString}`
    ).bind(...bindings);

    const [episodesDbResult, countResult] = await Promise.all([
      episodesQuery.all<any>(), 
      countQuery.first<{ total: number }>()
    ]);

    if (!episodesDbResult.results || countResult === null) {
        console.error('Failed to fetch episodes or count, D1 results:', episodesDbResult, countResult);
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to retrieve episodes from the database.'}), 500);
    }

    // Process each raw DB episode with EpisodeSchema for transformations (JSON parsing, date coercion)
    // Then, ensure the result conforms to EpisodeListItemSchema (which picks from EpisodeSchema's output type)
    const processedEpisodes = episodesDbResult.results.map(dbEpisode => {
      const parsedEpisode = EpisodeSchema.safeParse(dbEpisode);
      if (!parsedEpisode.success) {
        // Log the error for this specific episode and potentially skip it or handle error
        console.error(`Error parsing episode ID ${dbEpisode.id} in list:`, parsedEpisode.error.flatten());
        return null; // Or throw, or return a specific error structure for this item
      }
      // EpisodeListItemSchema picks from the output of EpisodeSchema, so this is fine.
      // We just need to ensure the final array is of EpisodeListItemSchema type.
      return parsedEpisode.data;
    }).filter(Boolean); // Remove any nulls from parsing errors

    // Validate the array of processed episodes against z.array(EpisodeListItemSchema)
    // This step is somewhat redundant if EpisodeListItemSchema correctly picks from EpisodeSchema's output type,
    // but it's a good final check for the overall list structure.
    const validatedEpisodesList = z.array(EpisodeListItemSchema).safeParse(processedEpisodes);

    if (!validatedEpisodesList.success) {
        console.error('Final episode list validation error:', validatedEpisodesList.error.flatten());
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error validating final episode list structure.'}), 500);
    }

    // If countResult were null, we would have returned an error earlier.
    const totalItems = countResult!.total; 
    const totalPages = Math.ceil(totalItems / limit);

    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
    };

    return c.json(ListEpisodesResponseSchema.parse({
      success: true,
      episodes: validatedEpisodesList.data, // Corrected variable name
      pagination: pagination,
    }), 200);

  } catch (error) {
    console.error('Error listing episodes:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to list episodes due to a server error.' }), 500);
  }
};