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
import { createCategoryHandler } from '../handlers/categories/createCategory.handler';
import { listCategoriesHandler } from '../handlers/categories/listCategories.handler';
import { getCategoryByIdHandler } from '../handlers/categories/getCategoryById.handler';
import { updateCategoryHandler } from '../handlers/categories/updateCategory.handler';
import { deleteCategoryHandler } from '../handlers/categories/deleteCategory.handler';

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
categoryRoutes.openapi(createCategoryRouteDef, createCategoryHandler);

// GET /categories
const listCategoriesRouteDef = createRoute({
  method: 'get', path: '/',
  responses: {
    200: { content: { 'application/json': { schema: ListCategoriesResponseSchema } }, description: 'List of categories' },
    500: { content: { 'application/json': { schema: GeneralServerErrorSchema } }, description: 'Server error' },
  },
  summary: 'Lists all categories.', tags: ['Categories'],
});
categoryRoutes.openapi(listCategoriesRouteDef, listCategoriesHandler);

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
categoryRoutes.openapi(getCategoryByIdRouteDef, getCategoryByIdHandler);

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
categoryRoutes.openapi(updateCategoryRouteDef, updateCategoryHandler);

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
categoryRoutes.openapi(deleteCategoryRouteDef, deleteCategoryHandler);

export default categoryRoutes;
