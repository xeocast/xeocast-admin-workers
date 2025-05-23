import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PodcastUpdateRequestSchema } from '../../schemas/podcastSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const updatePodcastHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());
  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);

  const body = await c.req.json().catch(() => null);
  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = PodcastUpdateRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('Update podcast validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for updating podcast.', cause: validationResult.error });
  }

  const updateData = validationResult.data;
  console.log('Attempting to update podcast ID:', id, 'with data:', updateData);

  // Placeholder for actual podcast update logic
  // 1. Find podcast by ID
  // 2. Validate category_id and series_id if provided and changed
  // 3. If title changed, regenerate slug (or allow manual slug update)
  // 4. Update podcast in the database

  // Simulate success / not found
  if (id === 1) { // Assuming podcast with ID 1 exists for mock
    return c.json({ success: true, message: 'Podcast updated successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'Podcast not found.' });
};
