import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { CategorySummarySchema } from '../../schemas/categorySchemas'; // For mock data
import { z } from 'zod';

// Define a schema for query parameters if needed, e.g., for pagination or filtering
const ListCategoriesQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  language_code: z.string().optional(), // Example filter
});

export const listCategoriesHandler = async (c: Context) => {
  const queryParseResult = ListCategoriesQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    throw new HTTPException(400, { message: 'Invalid query parameters.', cause: queryParseResult.error });
  }

  const { page, limit, language_code } = queryParseResult.data;
  console.log('Listing categories with query:', { page, limit, language_code });

  // Placeholder for actual category listing logic
  // 1. Fetch categories from database, applying filters and pagination

  // Simulate success with mock data
  const placeholderCategory = CategorySummarySchema.parse({
    id: 1,
    name: 'Sample Category',
    language_code: language_code || 'en',
  });
  const responsePayload = { success: true, categories: [placeholderCategory], total: 1, page: page || 1, limit: limit || 10 };
  return c.json(responsePayload, 200);
};
