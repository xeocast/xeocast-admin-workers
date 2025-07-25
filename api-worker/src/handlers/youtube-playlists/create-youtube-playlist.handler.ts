import { Context } from 'hono';
import { z } from '@hono/zod-openapi'; // Added for z.literal
import type { CloudflareEnv } from '../../env';
import {
  YouTubePlaylistCreateRequestSchema,
  YouTubePlaylistCreateResponseSchema,
  YouTubePlaylistPlatformIdExistsErrorSchema,
  YouTubePlaylistCreateFailedErrorSchema
} from '../../schemas/youtube-playlist.schemas';
import { GeneralServerErrorSchema } from '../../schemas/common.schemas';

export const createYouTubePlaylistHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch {
    return c.json(YouTubePlaylistCreateFailedErrorSchema.parse({ message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = YouTubePlaylistCreateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(YouTubePlaylistCreateFailedErrorSchema.parse({ 
        
        message: 'Invalid input for creating YouTube playlist.'
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { 
    seriesId,
    channelId,
    youtubePlatformId,
    title,
    description, // Now non-nullable as per updated schema
    // thumbnail_url was removed from schema
  } = validationResult.data;

  try {
    // Validate foreign keys
    const channelExists = await c.env.DB.prepare('SELECT id FROM youtube_channels WHERE id = ?1').bind(channelId).first();
    if (!channelExists) {
      return c.json(YouTubePlaylistCreateFailedErrorSchema.parse({ message: `YouTube channel with id ${channelId} not found.` }), 400);
    }

    const seriesExists = await c.env.DB.prepare('SELECT id FROM series WHERE id = ?1').bind(seriesId).first();
    if (!seriesExists) {
      return c.json(YouTubePlaylistCreateFailedErrorSchema.parse({ message: `Series with id ${seriesId} not found.` }), 400);
    }

    // Check for youtubePlatformId uniqueness (globally, as per DB constraint)
    const platformIdExists = await c.env.DB.prepare('SELECT id FROM youtube_playlists WHERE youtube_platform_id = ?1')
      .bind(youtubePlatformId).first();
    if (platformIdExists) {
      // The schema YouTubePlaylistPlatformIdExistsErrorSchema says '...for this channel', but DB constraint is global.
      // Adjusting message to reflect global uniqueness.
      return c.json(YouTubePlaylistPlatformIdExistsErrorSchema.extend({message: z.literal('YouTube playlist platform ID already exists.')}).parse({ 
          
          message: 'YouTube playlist platform ID already exists.' 
      }), 400);
    }

    const stmt = c.env.DB.prepare(
      'INSERT INTO youtube_playlists (youtube_platform_id, title, description, channel_id, series_id) VALUES (?1, ?2, ?3, ?4, ?5)'
    ).bind(youtubePlatformId, title, description, channelId, seriesId);
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(YouTubePlaylistCreateResponseSchema.parse({
        
        message: 'YouTube playlist created successfully.',
        id: result.meta.last_row_id
      }), 201);
    } else {
      return c.json(YouTubePlaylistCreateFailedErrorSchema.parse({ message: 'Failed to create YouTube playlist in database.' }), 500);
    }

  } catch (error: any) {
    console.error('Error creating YouTube playlist:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed: youtube_playlists.youtube_platform_id')) {
        return c.json(YouTubePlaylistPlatformIdExistsErrorSchema.extend({message: z.literal('YouTube playlist platform ID already exists.')}).parse({ 
            
            message: 'YouTube playlist platform ID already exists.' 
        }), 400);
    }
    // Catch other DB constraint errors e.g. FOREIGN KEY
    if (error.message && error.message.toLowerCase().includes('constraint failed')) {
        return c.json(YouTubePlaylistCreateFailedErrorSchema.parse({ message: `Database constraint failed: ${error.message}`}), 400);
    }
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to create YouTube playlist due to a server error.' }), 500);
  }
};
