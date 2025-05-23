import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PodcastCreateRequestSchema } from '../../schemas/podcastSchemas';

export const createPodcastHandler = async (c: Context) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = PodcastCreateRequestSchema.safeParse(body);

  if (!validationResult.success) {
    console.error('Create podcast validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for creating podcast.', cause: validationResult.error });
  }

  const podcastData = validationResult.data;
  console.log('Attempting to create podcast with data:', podcastData);

  // Placeholder for actual podcast creation logic
  // 1. Validate category_id and series_id if provided
  // 2. Generate slug if not provided
  // 3. Store podcast in the database

  // Simulate success for now
  const mockPodcastId = Math.floor(Math.random() * 10000) + 100;
  return c.json({ success: true, message: 'Podcast created successfully.' as const, podcastId: mockPodcastId }, 201);
};
