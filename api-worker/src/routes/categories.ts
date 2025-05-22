// src/routes/categories.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  CategoryCreateRequestSchema,
  CategoryCreateResponseSchema,
  ListCategoriesResponseSchema,
  GetCategoryResponseSchema,
  CategoryUpdateRequestSchema,
  CategoryUpdateResponseSchema,
  CategoryDeleteResponseSchema,
  CategoryNameExistsErrorSchema,
  CategoryCreateFailedErrorSchema,
  CategoryNotFoundErrorSchema,
  CategoryUpdateFailedErrorSchema,
  CategoryDeleteFailedErrorSchema,
  CategorySchema, // For placeholder in GET by ID
  CategorySummarySchema, // For placeholder in LIST
} from '../schemas/categorySchemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../schemas/commonSchemas';

const categoryRoutes = new OpenAPIHono();

// POST /categories
const createCategoryRouteDef = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: { content: { 'application/json': { schema: CategoryCreateRequestSchema } } },
  },
  responses: {
    201: { content: { 'application/json': { schema: CategoryCreateResponseSchema } }, description: 'Category created' },
    400: { content: { 'application/json': { schema: z.union([CategoryNameExistsErrorSchema, CategoryCreateFailedErrorSchema]) } }, description: 'Invalid input' },
    500: { content: { 'application/json': { schema: CategoryCreateFailedErrorSchema } }, description: 'Server error' },
  },
  summary: 'Creates a new category.', tags: ['Categories'],
});
categoryRoutes.openapi(createCategoryRouteDef, (c) => {
  console.log('Create category:', c.req.valid('json'));
  return c.json({ success: true, message: 'Category created successfully.' as const, categoryId: 1 }, 201);
});

// GET /categories
const listCategoriesRouteDef = createRoute({
  method: 'get', path: '/',
  responses: {
    200: { content: { 'application/json': { schema: ListCategoriesResponseSchema } }, description: 'List of categories' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all categories.', tags: ['Categories'],
});
categoryRoutes.openapi(listCategoriesRouteDef, (c) => {
  console.log('List categories');
  const placeholderCategory = CategorySummarySchema.parse({ id: 1, name: 'Sample Category', language_code: 'en' });
  const responsePayload = { success: true, categories: [placeholderCategory] };
  return c.json(ListCategoriesResponseSchema.parse(responsePayload), 200);
});

// GET /categories/{id}
const getCategoryByIdRouteDef = createRoute({
  method: 'get', path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: GetCategoryResponseSchema } }, description: 'Category details' },
    404: { content: { 'application/json': { schema: CategoryNotFoundErrorSchema } }, description: 'Not found' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Gets a category by ID.', tags: ['Categories'],
});
categoryRoutes.openapi(getCategoryByIdRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Get category by ID:', id);
  const placeholderCategory = CategorySchema.parse({
    id: parseInt(id) || 1, name: "Tech", description: "...", default_source_background_bucket_key: "a",
    default_source_thumbnail_bucket_key: "b", prompt_template_to_gen_evergreen_titles: "c",
    prompt_template_to_gen_news_titles: "d", prompt_template_to_gen_series_titles: "e",
    prompt_template_to_gen_article_content: "f", prompt_template_to_gen_description: "g",
    prompt_template_to_gen_short_description: "h", prompt_template_to_gen_tag_list: "i",
    prompt_template_to_gen_audio_podcast: "j", prompt_template_to_gen_video_thumbnail: "k",
    prompt_template_to_gen_article_image: "l", language_code: "en",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  });
  return c.json({ success: true, category: placeholderCategory }, 200);
});

// PUT /categories/{id}
const updateCategoryRouteDef = createRoute({
  method: 'put', path: '/{id}',
  request: {
    params: PathIdParamSchema,
    body: { content: { 'application/json': { schema: CategoryUpdateRequestSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: CategoryUpdateResponseSchema } }, description: 'Category updated' },
    400: { content: { 'application/json': { schema: z.union([CategoryNameExistsErrorSchema, CategoryUpdateFailedErrorSchema]) } }, description: 'Invalid input' },
    404: { content: { 'application/json': { schema: CategoryNotFoundErrorSchema } }, description: 'Not found' },
    500: { content: { 'application/json': { schema: CategoryUpdateFailedErrorSchema } }, description: 'Server error' },
  },
  summary: 'Updates a category.', tags: ['Categories'],
});
categoryRoutes.openapi(updateCategoryRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Update category:', id, c.req.valid('json'));
  return c.json({ success: true, message: 'Category updated successfully.' as const }, 200);
});

// DELETE /categories/{id}
const deleteCategoryRouteDef = createRoute({
  method: 'delete', path: '/{id}',
  request: { params: PathIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: CategoryDeleteResponseSchema } }, description: 'Category deleted' },
    400: { content: { 'application/json': { schema: CategoryDeleteFailedErrorSchema } }, description: 'Deletion failed (e.g. constraints)' },
    404: { content: { 'application/json': { schema: CategoryNotFoundErrorSchema } }, description: 'Not found' },
    500: { content: { 'application/json': { schema: CategoryDeleteFailedErrorSchema } }, description: 'Server error' },
  },
  summary: 'Deletes a category.', tags: ['Categories'],
});
categoryRoutes.openapi(deleteCategoryRouteDef, (c) => {
  const { id } = c.req.valid('param');
  console.log('Delete category:', id);
  return c.json({ success: true, message: 'Category deleted successfully.' as const }, 200);
});

export default categoryRoutes;
