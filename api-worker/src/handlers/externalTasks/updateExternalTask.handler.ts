import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import {
  ExternalTaskUpdateRequestSchema,
  ExternalTaskUpdateResponseSchema,
} from '../../schemas/externalTaskSchemas';
import {
  PathIdParamSchema,
  GeneralBadRequestErrorSchema,
  GeneralNotFoundErrorSchema,
  GeneralServerErrorSchema,
  MessageResponseSchema
} from '../../schemas/commonSchemas';

export const updateExternalTaskHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
  const paramValidation = PathIdParamSchema.safeParse(c.req.param());
  if (!paramValidation.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid ID format.' }), 400);
  }
  const id = parseInt(paramValidation.data.id, 10);

  let requestBody;
  try {
    requestBody = await c.req.json();
  } catch (error) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'Invalid JSON payload.' }), 400);
  }

  const validationResult = ExternalTaskUpdateRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return c.json(GeneralBadRequestErrorSchema.parse({ 
        success: false, 
        message: 'Invalid input for updating external task.',
        // errors: validationResult.error.flatten().fieldErrors 
    }), 400);
  }

  const { status, external_service_id, payload } = validationResult.data;
  // Note: 'result', 'attempts', 'last_attempted_at' from schema are not in DB table 'external_service_tasks'
  // and thus will not be updated here.

  const updateFields: string[] = [];
  const bindings: (string | number | null)[] = [];
  let bindingIndex = 1;

  if (status !== undefined) {
    updateFields.push(`status = ?${bindingIndex}`);
    bindings.push(status);
    bindingIndex++;
  }
  if (external_service_id !== undefined) {
    updateFields.push(`external_task_id = ?${bindingIndex}`);
    bindings.push(external_service_id);
    bindingIndex++;
  }
  if (payload !== undefined) {
    updateFields.push(`data = ?${bindingIndex}`);
    bindings.push(JSON.stringify(payload));
    bindingIndex++;
  }

  if (updateFields.length === 0) {
    return c.json(GeneralBadRequestErrorSchema.parse({ success: false, message: 'No fields provided to update.' }), 400);
  }

  // Always update 'updated_at'
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

  const query = `UPDATE external_service_tasks SET ${updateFields.join(', ')} WHERE id = ?${bindingIndex}`;
  bindings.push(id);

  try {
    const stmt = c.env.DB.prepare(query).bind(...bindings);
    const result = await stmt.run();

    if (result.success && result.meta.changes > 0) {
      return c.json(ExternalTaskUpdateResponseSchema.parse({ success: true, message: 'External task updated successfully.' }), 200);
    } else if (result.success && result.meta.changes === 0) {
      // Check if the task actually exists, as 'changes === 0' could mean task not found or data was same
      const checkStmt = c.env.DB.prepare('SELECT id FROM external_service_tasks WHERE id = ?1').bind(id);
      const taskExists = await checkStmt.first();
      if (!taskExists) {
        return c.json(GeneralNotFoundErrorSchema.parse({ success: false, message: 'External task not found.' }), 404);
      }
      // If task exists but no changes, it means the provided data was the same as existing data.
      // Depending on desired behavior, this could be a 200 OK with a specific message or still the generic success.
      return c.json(MessageResponseSchema.parse({ success: true, message: 'External task data was the same; no changes made.' }), 200);
    } else {
      console.error('Failed to update external task, D1 result:', result);
      return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to update external task.' }), 500);
    }
  } catch (error) {
    console.error(`Error updating external task ID ${id}:`, error);
    return c.json(GeneralServerErrorSchema.parse({ success: false, message: 'Failed to update external task due to a server error.' }), 500);
  }
};
