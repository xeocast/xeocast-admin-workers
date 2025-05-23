import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { YouTubeChannelSchema, ListYouTubeChannelsQuerySchema, ListYouTubeChannelsResponseSchema } from '../../schemas/youtubeChannelSchemas';
import { z } from 'zod';

export const listYouTubeChannelsHandler = async (c: Context) => {
  const queryParseResult = ListYouTubeChannelsQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    throw new HTTPException(400, { message: 'Invalid query parameters.', cause: queryParseResult.error });
  }

  const { category_id } = queryParseResult.data;
  console.log('Listing YouTube channels with query:', { category_id });

  // Placeholder for actual channel listing logic
  // 1. Fetch channels from database, applying filters (e.g., by category_id)

  // Simulate success with mock data
  const placeholderChannel = YouTubeChannelSchema.parse({
    id: 1,
    category_id: category_id || 1,
    youtube_platform_id: 'UCexamplechannel123',
    name: 'Sample Channel',
    description: 'This is a sample YouTube channel.',
    custom_url: '@SampleChannel',
    thumbnail_url: 'https://yt3.ggpht.com/sample_thumbnail.jpg',
    default_language: 'en-US',
    default_category_id_on_youtube: '22',
    prompt_template_for_title: 'Video Title: {topic}',
    prompt_template_for_description: 'Video Description: {details}',
    prompt_template_for_tags: 'tag1, tag2, {topic_tag}',
    prompt_template_for_first_comment: 'First comment: {engagement_question}',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const responsePayload: z.infer<typeof ListYouTubeChannelsResponseSchema> = { success: true, channels: [placeholderChannel] };
  return c.json(responsePayload, 200);
};
