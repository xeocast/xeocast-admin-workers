import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  UpdateExternalTaskSchema,
  ExternalTaskUpdateResponseSchema,
} from '../../schemas/external-task.schemas';
import {
  PathIdParamSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  MessageResponseSchema
} from '../../schemas/common.schemas';

export const updateExternalTaskHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = UpdateExternalTaskSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        
        message: 'Invalid input for updating external task.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { external_task_id, type, data, status } = validationResult.data;

  const updateFields: string[] = [];
  const bindings: (string | number | null | undefined)[] = [];
  let bindingIndex = 1;

  if (external_task_id !== undefined) {
    updateFields.push(`external_task_id = ?${bindingIndex}`);
    bindings.push(external_task_id);
    bindingIndex++;
  }
  if (type !== undefined) {
    updateFields.push(`type = ?${bindingIndex}`);
    bindings.push(type);
    bindingIndex++;
  }
  if (data !== undefined) { // data can be null, but if undefined, it's not part of the update
    updateFields.push(`data = ?${bindingIndex}`);
    bindings.push(JSON.stringify(data)); // data is z.any(), so it's already parsed from JSON if it was an object
    bindingIndex++;
  }
  if (status !== undefined) {
    updateFields.push(`status = ?${bindingIndex}`);
    bindings.push(status);
    bindingIndex++;
  }

  if (updateFields.length === 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({ message: 'No fields provided to update.' }), 400);
  }

  // Always update 'updated_at'
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

  const query = `UPDATE external_service_tasks SET ${updateFields.join(', ')} WHERE id = ?${bindingIndex}`;
  bindings.push(id);

  try {
    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(ExternalTaskUpdateResponseSchema.parse({ message: 'External task updated successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // Check if the task actually exists, as 'changes === 0' could mean task not found or data was same
      const checkStmt = c.env.DB.prepare('SELECT id FROM external_service_tasks WHERE id = ?1').bind(id);
      const taskExists = await checkStmt.first();
      if (!taskExists) {
        return c.json(GeneralNotFoundErrorSchema.parse({ message: 'External task not found.' }), 404);
      }
      // If task exists but no changes, it means the provided data was the same as existing data.
      // Depending on desired behavior, this could be a 200 OK with a specific message or still the generic success.
      return c.json(MessageResponseSchema.parse({ message: 'External task data was the same; no changes made.' }), 200);
    } else {
      console.error('Failed to update external task, D1 result:', result);
      return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to update external task.' }), 500);
    }
  } catch (error) {
    console.error(`Error updating external task ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to update external task due to a server error.' }), 500);
  }
};
