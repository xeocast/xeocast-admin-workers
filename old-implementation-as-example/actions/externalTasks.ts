import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';

// Schemas
const ListExternalTasksFiltersSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(20),
    status: z.string().optional(),
    type: z.string().optional(),
}).optional();

const ALL_EXTERNAL_TASK_FIELDS = `
    id, external_task_id, type, data, status,
    strftime('%Y-%m-%dT%H:%M:%fZ', created_at) as created_at,
    strftime('%Y-%m-%dT%H:%M:%fZ', updated_at) as updated_at
`;

const ExternalTaskSchema = z.object({
    id: z.number().int().positive(),
    external_task_id: z.string(),
    type: z.string(),
    data: z.string().refine(val => {
        try {
            JSON.parse(val);
            return true;
        } catch {
            return false;
        }
    }, { message: "Data must be a valid JSON string" }),
    status: z.enum(['pending', 'processing', 'completed', 'error']),
    created_at: z.string().datetime({ message: "Invalid created_at date format" }),
    updated_at: z.string().datetime({ message: "Invalid updated_at date format" }),
});

export const externalTasks = {
    listExternalTasks: defineAction({
        input: ListExternalTasksFiltersSchema,
        handler: async (filters, context: ActionAPIContext) => {
            const db = context.locals.runtime.env.DB;
            const { page = 1, limit = 20, status: filterStatus, type: filterType } = filters ?? {};

            try {
                let query = `SELECT ${ALL_EXTERNAL_TASK_FIELDS} FROM external_service_tasks`;
                let countQuery = `SELECT COUNT(*) as total FROM external_service_tasks`;
                const queryParams: any[] = [];
                const countQueryParams: any[] = [];
                const conditions: string[] = [];

                if (filterStatus) {
                    conditions.push(`status = ?`);
                    queryParams.push(filterStatus);
                    countQueryParams.push(filterStatus);
                }
                if (filterType) {
                    conditions.push(`type = ?`);
                    queryParams.push(filterType);
                    countQueryParams.push(filterType);
                }

                if (conditions.length > 0) {
                    const whereClause = ` WHERE ${conditions.join(' AND ')}`;
                    query += whereClause;
                    countQuery += whereClause;
                }

                query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
                queryParams.push(limit, (page - 1) * limit);

                const tasksStatement = db.prepare(query).bind(...queryParams);
                const countStatement = db.prepare(countQuery).bind(...countQueryParams);

                const [tasksResultRaw, countResult] = await Promise.all([
                    tasksStatement.all(),
                    countStatement.first<{ total: number }>()
                ]);

                if (!tasksResultRaw || countResult === null) {
                    return { success: false, message: 'Failed to retrieve tasks or count.' };
                }
                
                // Ensure tasksResultRaw is an array of objects before validation
                const tasksToValidate = Array.isArray(tasksResultRaw.results) ? tasksResultRaw.results : [];

                const validatedTasks = z.array(ExternalTaskSchema).safeParse(tasksToValidate);
                if (!validatedTasks.success) {
                    console.error("Error validating tasks:", validatedTasks.error.flatten());
                    return { 
                        success: false, 
                        message: 'Failed to validate tasks data.', 
                        errors: validatedTasks.error.flatten().fieldErrors 
                    };
                }

                return {
                    success: true,
                    tasks: validatedTasks.data,
                    total: countResult.total,
                    page,
                    limit,
                    totalPages: Math.ceil(countResult.total / limit)
                };

            } catch (error: any) {
                console.error("Error listing external tasks:", error);
                // Check for D1 specific errors if possible, e.g., error.cause
                let errorMessage = 'An unexpected error occurred.';
                if (error.message) {
                    errorMessage = error.message;
                }
                if (error.cause && typeof error.cause.message === 'string') {
                    errorMessage += ` (Cause: ${error.cause.message})`;
                }
                return { success: false, message: errorMessage };
            }
        }
    })
};