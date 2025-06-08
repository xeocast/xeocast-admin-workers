import { Context } from 'hono';
import { z } from 'zod';
import type { CloudflareEnv } from '../../env';
import {
  ExternalTaskSchema,
  ExternalTaskStatusSchema,
  ExternalTaskTypeSchema,
  ListExternalTasksQuerySchema,
  ListExternalTasksResponseSchema
} from '../../schemas/externalTaskSchemas';
import { GeneralBadRequestErrorSchema, GeneralServerErrorSchema, PaginationInfoSchema } from '../../schemas/commonSchemas';

interface ExternalTaskFromDB {
  id: number;
  external_task_id: string; // Corresponds to external_task_id in schema
  type: z.infer<typeof ExternalTaskTypeSchema>; // Corresponds to type in schema
  data: string; // JSON string, corresponds to data in schema (which is z.any())
  status: z.infer<typeof ExternalTaskStatusSchema>; // Corresponds to status in schema
  created_at: string;
  updated_at: string;
}

export const listExternalTasksHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const queryParseResult = ListExternalTasksQuerySchema.safeParse(c.req.query());

  if (!queryParseResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        success: false, 
        message: 'Invalid query parameters.',
        // errors: queryParseResult.error.flatten().fieldErrors
    }), 400);
  }

  const { page = 1, limit = 10, type, status } = queryParseResult.data;
  const offset = (page - 1) * limit;
  const requestTimezone = c.req.header('CF-Timezone');

  try {
    let baseQuery = 'FROM external_service_tasks';
    const conditions: string[] = [];
    const bindings: (string | number)[] = [];
    let bindingIndex = 1;

    if (type) {
      conditions.push(`type = ?${bindingIndex}`);
      bindings.push(type);
      bindingIndex++;
    }
    if (status) {
      conditions.push(`status = ?${bindingIndex}`);
      bindings.push(status);
      bindingIndex++;
    }
    // episode_id filter cannot be applied here.

    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    // Query for tasks
    const tasksQuery = `SELECT id, external_task_id, type, data, status, created_at, updated_at ${baseQuery}${whereClause} ORDER BY created_at DESC LIMIT ?${bindingIndex} OFFSET ?${bindingIndex + 1}`;
    const tasksBindings = [...bindings, limit, offset];
    const tasksStmt = c.env.DB.prepare(tasksQuery).bind(...tasksBindings);
    const { results: dbTasks } = await tasksStmt.all<ExternalTaskFromDB>();

    // Query for total count
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}${whereClause}`;
    const countStmt = c.env.DB.prepare(countQuery).bind(...bindings);
    const totalResult = await countStmt.first<{ total: number }>();
    const totalItems = totalResult?.total || 0;

    if (!dbTasks) {
      return c.json(ListExternalTasksResponseSchema.parse({
        success: true, 
        tasks: [], 
        pagination: { page, limit, totalItems, totalPages: 0 }
      }), 200);
    }

    const tasks = dbTasks.map(dbTask => {
      let parsedData = null;
      try {
        parsedData = JSON.parse(dbTask.data);
      } catch (e) {
        console.warn(`Failed to parse 'data' for task ID ${dbTask.id}:`, e);
        // Keep parsedData as null if parsing fails, schema expects z.any()
      }
      
      let createdAtOutput = dbTask.created_at;
      let updatedAtOutput = dbTask.updated_at;

      if (requestTimezone) {
        try {
          const createdAtDate = new Date(dbTask.created_at);
          const updatedAtDate = new Date(dbTask.updated_at);

          if (!isNaN(createdAtDate.getTime())) {
            createdAtOutput = createdAtDate.toLocaleString('en-US', { timeZone: requestTimezone });
          } else {
            console.warn(`Invalid created_at date string from DB for task ID ${dbTask.id}: ${dbTask.created_at}`);
          }

          if (!isNaN(updatedAtDate.getTime())) {
            updatedAtOutput = updatedAtDate.toLocaleString('en-US', { timeZone: requestTimezone });
          } else {
            console.warn(`Invalid updated_at date string from DB for task ID ${dbTask.id}: ${dbTask.updated_at}`);
          }
        } catch (error) { // Catches errors from toLocaleString, e.g., invalid timezone
          console.warn(`Failed to format dates for timezone '${requestTimezone}', task ID ${dbTask.id}:`, error);
          // In case of error, createdAtOutput/updatedAtOutput retain their original DB values
        }
      }
      
      console.log('db created_at', dbTask.created_at);
      console.log('db updated_at', dbTask.updated_at);
      console.log('requestTimezone', requestTimezone);
      console.log('created_at', createdAtOutput);
      console.log('updated_at', updatedAtOutput);

      const taskForValidation = {
        id: dbTask.id,
        external_task_id: dbTask.external_task_id,
        type: dbTask.type,
        data: parsedData, // Assign the parsed JSON data
        status: dbTask.status,
        created_at: createdAtOutput,
        updated_at: updatedAtOutput,
      };

      // Validate each task against the schema before sending
      const validation = ExternalTaskSchema.safeParse(taskForValidation);
      if (validation.success) {
        return validation.data;
      } else {
        console.error(`Data validation failed for task ID ${dbTask.id} (potentially due to date format change):`, validation.error.flatten());
        // Return null or a specific error structure for problematic tasks
        // For simplicity, returning null and filtering out later or handling as error
        return null; 
      }
    }).filter(task => task !== null) as z.infer<typeof ExternalTaskSchema>[]; // Type assertion after filter

    const pagination = PaginationInfoSchema.parse({
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
    });

    return c.json(ListExternalTasksResponseSchema.parse({ success: true, tasks, pagination }), 200);

  } catch (error) {
    console.error('Error listing external tasks:', error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to list external tasks due to a server error.' }), 500);
  }
};
