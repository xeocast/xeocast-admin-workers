import { Context } from 'hono';
import { z } from 'zod';
import type { CloudflareEnv } from '../../env';
import {
  ExternalTaskSchema,
  ExternalTaskStatusSchema,
  ExternalTaskTypeSchema,
  GetExternalTaskResponseSchema
} from '../../schemas/external-task.schemas';
import {
  PathIdParamSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema
} from '../../schemas/common.schemas';

interface ExternalTaskFromDB {
  id: number;
  external_task_id: string;
  type: z.infer<typeof ExternalTaskTypeSchema>;
  data: string; // JSON string
  status: z.infer<typeof ExternalTaskStatusSchema>;
  created_at: string;
  updated_at: string;
}

export const getExternalTaskByIdHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const params = PathIdParamSchema.safeParse(c.req.param());

  if (!params.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        
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
      return c.json(GeneralNotFoundErrorSchema.parse({ message: 'External task not found.' }), 404);
    }

    let parsedData = null;
    try {
      parsedData = JSON.parse(dbTask.data);
    } catch (e) {
      console.warn(`Failed to parse 'data' for task ID ${dbTask.id}:`, e);
      // Keep parsedData as null if parsing fails, schema expects z.any()
    }

        const taskForValidation = {
      id: dbTask.id,
      externalTaskId: dbTask.external_task_id,
      type: dbTask.type,
      data: parsedData,
      status: dbTask.status,
      createdAt: dbTask.created_at,
      updatedAt: dbTask.updated_at,
    };

    const validation = ExternalTaskSchema.safeParse(taskForValidation);
    if (!validation.success) {
      console.error(`Data for task ID ${dbTask.id} failed ExternalTaskSchema validation:`, validation.error.flatten());
      // This case indicates a potential mismatch between DB data and schema, or bad data in DB.
      return c.json(GeneralServerErrorSchema.parse({ message: 'Error processing task data.' }), 500);
    }

    return c.json(GetExternalTaskResponseSchema.parse({ task: validation.data }), 200);

  } catch (error) {
    console.error(`Error fetching external task by ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to fetch external task due to a server error.' }), 500);
  }
};
