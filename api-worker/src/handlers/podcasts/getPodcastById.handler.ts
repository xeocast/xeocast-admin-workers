import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PodcastSchema } from '../../schemas/podcastSchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const getPodcastByIdHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to get podcast by ID:', id);

  // Placeholder for actual logic to fetch podcast by ID
  // 1. Fetch podcast from database

  // Simulate success / not found
  if (id === 1) { // Assuming podcast with ID 1 exists for mock
    const placeholderPodcast = PodcastSchema.parse({
      id: id,
      title: 'Fetched Podcast Episode',
      description: 'Detailed description of the fetched podcast episode.',
      markdown_content: '# Fetched Episode\nThis is the full markdown content.',
      category_id: 1,
      series_id: 1,
      status: 'published',
      scheduled_publish_at: null,
      slug: 'fetched-podcast-episode',
      audio_bucket_key: 'podcasts/audio/fetched-audio.mp3',
      video_bucket_key: 'podcasts/video/fetched-video.mp4',
      thumbnail_bucket_key: 'podcasts/thumbnails/fetched-thumbnail.png',
      duration_seconds: 2000,
      youtube_video_id: 'fetchedYouTubeVideoId',
      youtube_playlist_id: 'fetchedYouTubePlaylistId',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    });
    return c.json({ success: true, podcast: placeholderPodcast }, 200);
  }
  throw new HTTPException(404, { message: 'Podcast not found.' });
};
