import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { ExternalTaskDeleteResponseSchema } from '../../schemas/externalTaskSchemas';
import {
  PathIdParamSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema
} from '../../schemas/commonSchemas';

export const deleteExternalTaskHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());

  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  try {
    const stmt = c.env.DB.prepare('DELETE FROM external_service_tasks WHERE id = ?1').bind(id);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(ExternalTaskDeleteResponseSchema.parse({ message: 'External task deleted successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      return c.json(GeneralNotFoundErrorSchema.parse({ message: 'External task not found.' }), 404);
    } else {
      console.error('Failed to delete external task, D1 result:', result);
      return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to delete external task.' }), 500);
    }
  } catch (error) {
    console.error(`Error deleting external task ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to delete external task due to a server error.' }), 500);
  }
};
