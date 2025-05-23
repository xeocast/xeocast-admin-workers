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
  external_task_id: string | null; // Mapped to external_service_id in schema
  type: z.infer<typeof ExternalTaskTypeSchema>; // Mapped to task_type in schema
  data: string; // JSON string, mapped to payload in schema
  status: z.infer<typeof ExternalTaskStatusSchema>;
  // DB schema for external_service_tasks does not have podcast_id, attempts, last_attempted_at, result
  // These will be undefined or null when mapping to ExternalTaskSchema if not present
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

  const { page = 1, limit = 10, task_type, status /*, podcast_id */ } = queryParseResult.data;
  // Note: podcast_id filter is ignored as 'external_service_tasks' table doesn't have podcast_id.
  const offset = (page - 1) * limit;

  try {
    let baseQuery = 'FROM external_service_tasks';
    const conditions: string[] = [];
    const bindings: (string | number)[] = [];
    let bindingIndex = 1;

    if (task_type) {
      conditions.push(`type = ?${bindingIndex}`);
      bindings.push(task_type);
      bindingIndex++;
    }
    if (status) {
      conditions.push(`status = ?${bindingIndex}`);
      bindings.push(status);
      bindingIndex++;
    }
    // podcast_id filter cannot be applied here.

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
      let payload = null;
      try {
        payload = JSON.parse(dbTask.data);
      } catch (e) {
        console.warn(`Failed to parse 'data' for task ID ${dbTask.id}:`, e);
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
        podcast_id: undefined, // Or null, depending on schema definition
        result: undefined,
        attempts: undefined, // Or 0 if schema defaults
        last_attempted_at: undefined,
      };

      const validation = ExternalTaskSchema.safeParse(taskForValidation);
      if (!validation.success) {
        console.warn(`Data for task ID ${dbTask.id} failed ExternalTaskSchema validation:`, validation.error.flatten());
        return null; 
      }
      return validation.data;
    }).filter(t => t !== null) as z.infer<typeof ExternalTaskSchema>[];

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
