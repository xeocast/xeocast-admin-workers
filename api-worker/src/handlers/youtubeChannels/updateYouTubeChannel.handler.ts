import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { YouTubeChannelUpdateRequestSchema } from '../../schemas/youtubeChannelSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const updateYouTubeChannelHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());
  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);

  const body = await c.req.json().catch(() => null);
  if (!body) {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  const validationResult = YouTubeChannelUpdateRequestSchema.safeParse(body);
  if (!validationResult.success) {
    console.error('Update YouTube channel validation error:', validationResult.error.flatten());
    throw new HTTPException(400, { message: 'Invalid input for updating YouTube channel.', cause: validationResult.error });
  }

  const updateData = validationResult.data;
  console.log('Attempting to update YouTube channel ID:', id, 'with data:', updateData);

  // Placeholder for actual channel update logic
  // 1. Find channel by ID
  // 2. Validate category_id if changed
  // 3. If youtube_platform_id changed, check if the new one already exists for another channel
  // 4. Update channel in the database

  // Simulate success / not found / platform ID exists error
  if (id === 1) { // Assuming channel with ID 1 exists for mock
    // if (updateData.youtube_platform_id === 'EXISTING_ID_DIFFERENT_CHANNEL') {
    //   throw new HTTPException(400, { message: 'YouTube platform ID already exists for another channel.'});
    // }
    return c.json({ success: true, message: 'YouTube channel updated successfully.' as const }, 200);
  }
  throw new HTTPException(404, { message: 'YouTube channel not found.' });
};
