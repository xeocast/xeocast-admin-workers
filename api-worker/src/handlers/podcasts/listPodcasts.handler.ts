import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PodcastSchema, PodcastStatusSchema } from '../../schemas/podcastSchemas'; // For mock data
import { z } from 'zod';

const ListPodcastsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  status: PodcastStatusSchema.optional(),
  category_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  series_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});

export const listPodcastsHandler = async (c: Context) => {
  const queryParseResult = ListPodcastsQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    throw new HTTPException(400, { message: 'Invalid query parameters.', cause: queryParseResult.error });
  }

  const { page, limit, status, category_id, series_id } = queryParseResult.data;
  console.log('Listing podcasts with query:', { page, limit, status, category_id, series_id });

  // Placeholder for actual podcast listing logic
  // 1. Fetch podcasts from database, applying filters and pagination

  // Simulate success with mock data
  const placeholderPodcast = PodcastSchema.parse({
    id: 1,
    title: 'Sample Podcast Episode',
    description: 'This is a sample episode.',
    markdown_content: '# Sample Markdown Content\nThis is a sample podcast episode description in markdown format.',
    category_id: category_id || 1,
    series_id: series_id || 1,
    status: status || 'published',
    scheduled_publish_at: null,
    slug: 'sample-podcast-episode',
    audio_bucket_key: 'podcasts/audio/sample-audio.mp3',
    video_bucket_key: 'podcasts/video/sample-video.mp4',
    thumbnail_bucket_key: 'podcasts/thumbnails/sample-thumbnail.png',
    duration_seconds: 1800,
    youtube_video_id: 'sampleYouTubeVideoId',
    youtube_playlist_id: 'sampleYouTubePlaylistId',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: status === 'published' ? new Date().toISOString() : null,
  });
  const responsePayload = { success: true, podcasts: [placeholderPodcast], total: 1, page: page || 1, limit: limit || 10 };
  return c.json(responsePayload, 200);
};
