import { Context } from 'hono';
import { z } from 'zod';
import type { CloudflareEnv } from '../../env';
import {
  ExternalTaskSchema,
  ExternalTaskStatusSchema,
  ExternalTaskTypeSchema,
  GetExternalTaskResponseSchema
} from '../../schemas/externalTaskSchemas';
import {
  PathIdParamSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema
} from '../../schemas/commonSchemas';

interface ExternalTaskFromDB {
  id: number;
  external_task_id: string | null;
  type: z.infer<typeof ExternalTaskTypeSchema>;
  data: string; // JSON string
  status: z.infer<typeof ExternalTaskStatusSchema>;
  created_at: string;
  updated_at: string;
  // Fields not in external_service_tasks table: podcast_id, result, attempts, last_attempted_at
}

export const getExternalTaskByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        success: false, 
        message: 'Invalid ID format.'
    }), 400);
  }
  const id = parseInt(params.data.id, 10);

  try {
    const stmt = c.env.DB.prepare(
      'SELECT id, external_task_id, type, data, status, created_at, updated_at FROM external_service_tasks WHERE id = ?1'
    ).bind(id);
    
    const dbTask = await stmt.first<ExternalTaskFromDB>();

    if (!dbTask) {
      return c.json(GeneralNotFoundErrorSchema.parse({ success: false, message: 'External task not found.' }), 404);
    }

    let payload = null;
    try {
      payload = JSON.parse(dbTask.data);
    } catch (e) {
      console.warn(`Failed to parse 'data' for task ID ${dbTask.id}:`, e);
      // Potentially return an error or a task with null payload if parsing is critical
    }

    const taskForValidation = {
      id: dbTask.id,
      external_service_id: dbTask.external_task_id,
      task_type: dbTask.type,
      payload: payload,
      status: dbTask.status,
      created_at: dbTask.created_at,
      updated_at: dbTask.updated_at,
      // Fields not in external_service_tasks table, will be undefined/defaulted by Zod if optional:
      podcast_id: undefined,
      result: undefined,
      attempts: undefined,
      last_attempted_at: undefined,
    };

    const validation = ExternalTaskSchema.safeParse(taskForValidation);
    if (!validation.success) {
      console.error(`Data for task ID ${dbTask.id} failed ExternalTaskSchema validation:`, validation.error.flatten());
      // This case indicates a potential mismatch between DB data and schema, or bad data in DB.
      return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Error processing task data.' }), 500);
    }

    return c.json(GetExternalTaskResponseSchema.parse({ success: true, task: validation.data }), 200);

  } catch (error) {
    console.error(`Error fetching external task by ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to fetch external task due to a server error.' }), 500);
  }
};
