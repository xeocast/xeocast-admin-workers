import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  CreateExternalTaskSchema,
  ExternalTaskCreateResponseSchema,
  ExternalTaskCreateFailedErrorSchema
} from '../../schemas/externalTaskSchemas';
import { GeneralServerErrorSchema } from '../../schemas/commonSchemas';

export const createExternalTaskHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(ExternalTaskCreateFailedErrorSchema.parse({ message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = CreateExternalTaskSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(ExternalTaskCreateFailedErrorSchema.parse({ 
        
        message: 'Invalid input for creating external task.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { external_task_id, type, data, status } = validationResult.data;

  try {
    const jsonData = JSON.stringify(data); // 'data' from schema is already named 'data' for DB

    const stmt = c.env.DB.prepare(
      'INSERT INTO external_service_tasks (external_task_id, type, data, status) VALUES (?1, ?2, ?3, ?4)'
    ).bind(external_task_id, type, jsonData, status);
    
    const result = await stmt.run();

    if (result.success && result.meta.last_row_id) {
      return c.json(ExternalTaskCreateResponseSchema.parse({
        
        message: 'External task created successfully.',
        taskId: result.meta.last_row_id // Internal ID of the created task, matching ExternalTaskCreateResponseSchema
      }), 201);
    } else {
      console.error('Failed to insert external task, D1 result:', result);
      return c.json(ExternalTaskCreateFailedErrorSchema.parse({ message: 'Failed to create external task.' }), 500);
    }

  } catch (error) {
    console.error('Error creating external task:', error);
    // Check for specific D1 errors like UNIQUE constraint if external_task_id needs to be unique (schema doesn't specify)
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to create external task due to a server error.' }), 500);
  }
};
