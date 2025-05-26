import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  PodcastSchema,
  GetPodcastResponseSchema,
  PodcastNotFoundErrorSchema
} from '../../schemas/podcastSchemas';
import { PathIdParamSchema, GeneralBadRequestErrorSchema, GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const getPodcastByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    const podcastDataFromDB = await c.env.DB.prepare('SELECT * FROM podcasts WHERE id = ?1').bind(id).first<any>();

    if (!podcastDataFromDB) {
      return c.json(PodcastNotFoundErrorSchema.parse({ success: false, message: 'Podcast not found.' }), 404);
    }

    // Prepare data for schema validation (parse tags)
    const dataForValidation = { ...podcastDataFromDB };
    if (typeof dataForValidation.tags === 'string') {
      try {
        dataForValidation.tags = JSON.parse(dataForValidation.tags);
      } catch (e) {
        console.error(`Error parsing tags for podcast ID ${id}:`, e);
        // Default to empty array or handle as per requirements if DB guarantees valid JSON or null
        dataForValidation.tags = []; 
      }
    } else if (dataForValidation.tags === null) {
      // If tags can be null in DB and schema supports nullable, this is fine.
      // PodcastSchema.tags is optional().nullable(), so null is acceptable.
    }
    // If tags is undefined or already an array, schema validation will handle it.

    // Validate the fetched data against the PodcastSchema
    const validatedPodcast = PodcastSchema.safeParse(dataForValidation);
    if (!validatedPodcast.success) {
      console.error('Podcast data validation error after fetching from DB (getById):', validatedPodcast.error.flatten());
      // This indicates a mismatch between DB schema and Zod schema, or bad data in DB
      return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error validating podcast data from database.'}), 500);
    }

    return c.json(GetPodcastResponseSchema.parse({ success: true, podcast: validatedPodcast.data }), 200);

  } catch (error) {
    console.error('Error fetching podcast by ID:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to fetch podcast due to a server error.' }), 500);
  }
};
