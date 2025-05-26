// api-worker/src/handlers/maintenance/regenerateSlugs.handler.ts
import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { GeneralServerErrorSchema } from '../../schemas/commonSchemas';
import { updateCategoryHandler } from '../categories/updateCategory.handler';
import { updateSeriesHandler } from '../series/updateSeries.handler';
import { updatePodcastHandler } from '../podcasts/updatePodcast.handler';

interface UpdateResponse { 
  success: boolean; 
  message?: string; 
}

interface Item {
  id: number;
}

async function processBatch(
  c: Context<{ Bindings: CloudflareEnv }>,
  entityType: 'categories' | 'series' | 'podcasts',
  items: Item[]
): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      const mockReq = {
        param: () => ({ id: item.id.toString() }), // Handlers expect c.req.param() to return an object for schema parsing
        json: async () => ({ slug: '' }), // Payload to trigger slug regeneration
        header: (name: string) => c.req.header(name), // Propagate original headers (e.g., for auth)
        url: c.req.url, // Provide the original URL
        method: 'PATCH', // Mimic the original method for the handler's logic if it checks
      };

      // Construct a context object for the handler call.
      // Spread the original context `c` to carry over `env`, `var`, `c.json` (response utility), etc.
      // Then override `req` with our mock.
      const handlerContext = {
        ...c,
        req: mockReq as any, // Using `as any` for simplicity, could be typed more strictly
      } as Context<{ Bindings: CloudflareEnv }>;

      let actualResponse: Response;

      if (entityType === 'categories') {
        actualResponse = await updateCategoryHandler(handlerContext);
      } else if (entityType === 'series') {
        actualResponse = await updateSeriesHandler(handlerContext);
      } else { // podcasts
        actualResponse = await updatePodcastHandler(handlerContext);
      }

      if (actualResponse.ok) {
        try {
            const responseBody = await actualResponse.json<UpdateResponse>();
            if (responseBody.success) {
              successCount++;
            } else {
              errorCount++;
              errors.push(`Failed to update ${entityType} ${item.id}: ${responseBody.message || 'Update handler reported failure.'}`);
            }
        } catch (jsonError: any) {
            errorCount++;
            errors.push(`Failed to parse JSON response for ${entityType} ${item.id}: ${jsonError.message}. Status: ${actualResponse.status}. Body: ${await actualResponse.text()}`);
        }
      } else {
        errorCount++;
        const errorBody = await actualResponse.text();
        errors.push(`Failed to call update for ${entityType} ${item.id}. Status: ${actualResponse.status}. Body: ${errorBody}`);
      }
    } catch (e: any) {
      errorCount++;
      errors.push(`Error processing ${entityType} ${item.id}: ${e.message}`);
      console.error(`Error during ${entityType} ${item.id} slug regeneration direct call:`, e);
    }
  }
  return { successCount, errorCount, errors };
}

export const regenerateSlugsHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  try {
    const db = c.env.DB;

    const categoriesQuery = db.prepare('SELECT id FROM categories').all<Item>();
    const seriesQuery = db.prepare('SELECT id FROM series').all<Item>();
    const podcastsQuery = db.prepare('SELECT id FROM podcasts').all<Item>();

    const [categoriesResult, seriesResult, podcastsResult] = await Promise.all([categoriesQuery, seriesQuery, podcastsQuery]);

    if (!categoriesResult?.results || !seriesResult?.results || !podcastsResult?.results) {
        return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to fetch items from database or results are null.'}), 500);
    }
    
    const categories = categoriesResult.results;
    const series = seriesResult.results;
    const podcasts = podcastsResult.results;
    
    const categoryProcessingResults = await processBatch(c, 'categories', categories);
    const seriesProcessingResults = await processBatch(c, 'series', series);
    const podcastProcessingResults = await processBatch(c, 'podcasts', podcasts);

    const totalSuccess = categoryProcessingResults.successCount + seriesProcessingResults.successCount + podcastProcessingResults.successCount;
    const totalErrors = categoryProcessingResults.errorCount + seriesProcessingResults.errorCount + podcastProcessingResults.errorCount;

    const allErrors = [...categoryProcessingResults.errors, ...seriesProcessingResults.errors, ...podcastProcessingResults.errors];

    const responseBody = {
      message: '',
      details: {
        categories: categoryProcessingResults,
        series: seriesProcessingResults,
        podcasts: podcastProcessingResults,
      },
      errors: allErrors.length > 0 ? allErrors : undefined,
    };

    if (totalErrors > 0) {
      console.error('Slug regeneration finished with errors:', allErrors);
      responseBody.message = `Slug regeneration completed with ${totalErrors} errors and ${totalSuccess} successes.`;
      return c.json({ success: false, ...responseBody }, 207); // Multi-Status
    }

    responseBody.message = `Slug regeneration completed successfully for ${totalSuccess} items.`;
    return c.json({ success: true, ...responseBody }, 200);

  } catch (error: any) {
    console.error('Error in regenerateSlugsHandler:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'An unexpected error occurred during slug regeneration.' }), 500);
  }
};