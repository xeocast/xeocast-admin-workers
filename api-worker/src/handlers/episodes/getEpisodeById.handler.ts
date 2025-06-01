import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  GetEpisodeResponseSchema,
  EpisodeNotFoundErrorSchema
} from '../../schemas/episodeSchemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const getEpisodeByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const { id } = c.req.param();
  const episodeId = parseInt(id, 10);

  if (isNaN(episodeId) || episodeId <= 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({
      success: false,
      message: 'Invalid episode ID. Must be a positive integer.'
    }), 400);
  }

  try {
    // Select all fields required by EpisodeSchema for transformation
    const stmt = c.env.DB.prepare(`
      SELECT 
        id, title, slug, description, markdown_content, show_id, series_id, status, 
        scheduled_publish_at, last_status_change_at, type, tags, created_at, updated_at, 
        audio_bucket_key, background_bucket_key, background_music_bucket_key, intro_music_bucket_key, 
        video_bucket_key, thumbnail_bucket_key, article_image_bucket_key,
        script, thumbnail_gen_prompt, article_image_gen_prompt,
        status_on_youtube, status_on_website, status_on_x, freezeStatus, first_comment
      FROM episodes 
      WHERE id = ?1
    `).bind(episodeId);

    const episode = await stmt.first<any>();

    if (!episode) {
      return c.json(EpisodeNotFoundErrorSchema.parse({
        success: false,
        message: 'Episode not found.'
      }), 404);
    }

    try {
      // Manually transform the episode data to match the expected output format
      // This avoids using the EpisodeSchema.transform which is causing issues
      const transformedEpisode = {
        ...episode,
        // Parse JSON strings into arrays/objects
        tags: (() => {
          try {
            const rawTags = episode.tags || '[]';
            // Check if the tags field is already a string representation of a JSON array
            let parsed;
            
            try {
              parsed = JSON.parse(rawTags);
              
              // Handle double-encoded JSON strings (a string that looks like "[\"tag1\",\"tag2\"]") 
              if (typeof parsed === 'string') {
                try {
                  parsed = JSON.parse(parsed);
                } catch (innerError) {
                  // If we can't parse it as JSON, treat it as a single tag
                  return [parsed];
                }
              }
              
              // Ensure it's an array of strings
              if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                return parsed;
              }
              
              console.warn(`Tags field was not a valid array of strings after parsing: ${JSON.stringify(parsed)}. Defaulting to [].`);
              return [];
            } catch (parseError) {
              // If parsing fails, check if it's a raw string and treat it as a single tag
              if (typeof rawTags === 'string' && rawTags.trim() !== '') {
                // If it's not valid JSON but is a non-empty string, treat it as a single tag
                return [rawTags];
              }
              console.error(`Error parsing tags: ${parseError}. Defaulting to [].`);
              return [];
            }
          } catch (e) {
            console.error(`Unexpected error handling tags: ${e}. Defaulting to [].`);
            return [];
          }
        })(),
        script: (() => {
          try {
            const rawScript = episode.script || '[]';
            let parsed;
            
            try {
              parsed = JSON.parse(rawScript);
              
              // Handle double-encoded JSON strings
              if (typeof parsed === 'string') {
                try {
                  parsed = JSON.parse(parsed);
                } catch (innerError) {
                  // If we can't parse it as JSON but it's a string, return it as is
                  console.warn(`Script field was a string but not valid JSON: ${parsed}. Using as is.`);
                  return parsed;
                }
              }
              
              return parsed;
            } catch (parseError) {
              console.error(`Error parsing script: ${parseError}. Defaulting to [].`);
              return [];
            }
          } catch (e) {
            console.error(`Unexpected error handling script: ${e}. Defaulting to [].`);
            return [];
          }
        })(),
        // Convert date strings to Date objects
        last_status_change_at: new Date(episode.last_status_change_at.replace(' ', 'T') + 'Z'),
        created_at: new Date(episode.created_at.replace(' ', 'T') + 'Z'),
        updated_at: new Date(episode.updated_at.replace(' ', 'T') + 'Z'),
        // Handle optional date
        scheduled_publish_at: episode.scheduled_publish_at ? new Date(episode.scheduled_publish_at) : null,
        // Ensure boolean type
        freezeStatus: Boolean(episode.freezeStatus)
      };

      // Return the transformed episode
      return c.json({
        success: true,
        episode: transformedEpisode
      }, 200);
    } catch (error) {
      console.error('Error transforming episode data:', error);
      return c.json(GeneralServerErrorSchema.parse({
        success: false,
        message: 'Error processing episode data.'
      }), 500);
    }

  } catch (error) {
    console.error('Error fetching episode by ID:', error);
    return c.json(GeneralServerErrorSchema.parse({
      success: false,
      message: 'Failed to retrieve episode due to a server error.'
    }), 500);
  }
};