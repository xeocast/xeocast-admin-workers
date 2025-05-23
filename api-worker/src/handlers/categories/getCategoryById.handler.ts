import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { CategorySchema } from '../../schemas/categorySchemas';
import { PathIdParamSchema } from '../../schemas/commonSchemas';

export const getCategoryByIdHandler = async (c: Context) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    throw new HTTPException(400, { message: 'Invalid ID format.', cause: params.error });
  }
  const id = parseInt(params.data.id);
  console.log('Attempting to get category by ID:', id);

  // Placeholder for actual logic to fetch category by ID
  // 1. Fetch category from database

  // Simulate success / not found
  if (id === 1) { // Assuming category with ID 1 exists for mock
    const placeholderCategory = CategorySchema.parse({
      id: id,
      name: "Tech Category",
      description: "All about technology.",
      default_source_background_bucket_key: "backgrounds/tech.jpg",
      default_source_thumbnail_bucket_key: "thumbnails/tech.png",
      prompt_template_to_gen_evergreen_titles: "Generate an evergreen title about {topic} in tech.",
      prompt_template_to_gen_news_titles: "Latest news on {topic} in the tech world.",
      prompt_template_to_gen_series_titles: "A series about {topic_in_series} in technology.",
      prompt_template_to_gen_article_content: "Write an article about {subject} in tech.",
      prompt_template_to_gen_description: "A brief description of {topic} related to tech.",
      prompt_template_to_gen_short_description: "Short summary of {topic} in tech.",
      prompt_template_to_gen_tag_list: "Tags for {topic}: tech, innovation, {sub_topic}",
      prompt_template_to_gen_audio_podcast: "Create a podcast script about {topic_audio} in tech.",
      prompt_template_to_gen_video_thumbnail: "Design a thumbnail for a video on {topic_video} in tech.",
      prompt_template_to_gen_article_image: "Find an image for an article on {topic_image} in tech.",
      language_code: "en",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return c.json({ success: true, category: placeholderCategory }, 200);
  }
  throw new HTTPException(404, { message: 'Category not found.' });
};
