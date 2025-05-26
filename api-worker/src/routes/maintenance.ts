// api-worker/src/routes/maintenance.ts
import { OpenAPIHono } from '@hono/zod-openapi';
import type { CloudflareEnv } from '../env'; // Ensure this path and type are correct
import { regenerateSlugsHandler } from '../handlers/maintenance/regenerateSlugs.handler';
import { 
  RegenerateSlugsSuccessResponseSchema, 
  RegenerateSlugsMultiStatusResponseSchema,
} from '../schemas/maintenanceSchemas';
import { GeneralServerErrorSchema as GeneralErrorSchema } from '../schemas/commonSchemas'; // Alias to keep usage below, or change usage // Assuming GeneralErrorSchema for 500

const app = new OpenAPIHono<{ Bindings: CloudflareEnv }>();

app.openapi(
  {
    method: 'post',
    path: '/regenerate-slugs',
    summary: 'Regenerate slugs for all categories, series, and podcasts.',
    description: 'This endpoint iterates through all categories, series, and podcasts, and triggers their respective update handlers with an empty slug to force slug regeneration. This is a potentially long-running operation and requires admin privileges. The request Authorization header will be passed to internal update calls.',
    request: {}, // No request body needed for this operation
    responses: {
      200: {
        description: 'Slugs regenerated successfully for all items or no items needed update.',
        content: { 'application/json': { schema: RegenerateSlugsSuccessResponseSchema } }
      },
      207: {
        description: 'Slug regeneration completed with some errors (Multi-Status). Check the details for specifics.',
        content: { 'application/json': { schema: RegenerateSlugsMultiStatusResponseSchema } }
      },
      500: {
        description: 'Internal server error during the regeneration process.',
        content: { 'application/json': { schema: GeneralErrorSchema } } // Or a more specific error schema
      },
      // Add 401/403 if auth middleware handles it before this point and you want to document it
    },
    tags: ['Maintenance'],
  },
  regenerateSlugsHandler
);

export default app;