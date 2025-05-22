import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';

// --- Schemas ---
// Schema for the role data expected from the DB
const RoleSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    // Add other role fields if necessary, e.g., permissions, description
});

// Schema for the output of the listRoles action
// This is not directly used in defineAction's `output` field but serves as a reference
// for the expected return structure and can be used for validation if needed elsewhere.
export const ListRolesOutputSchema = z.object({
    success: z.boolean(),
    roles: z.array(z.object({ name: z.string() })).optional(), // Expecting an array of objects with a name property
    message: z.string().optional(),
});

// --- Actions ---

export const roles = {
    listRoles: defineAction({
        // Output type is inferred from the handler's return type
        handler: async (_: undefined, context: ActionAPIContext) => {
            const db = context.locals.runtime.env.DB;
            try {
                const { results } = await db.prepare(
                    `SELECT name FROM roles ORDER BY name ASC`
                ).all<{ name: string }>(); // Specify that results will be an array of objects with a 'name' property

                if (!results) {
                    return { success: false, message: 'No roles found or failed to fetch roles.', roles: [] as {name: string}[] };
                }
                
                // The results from D1 `all()` are already in the format [{name: string}, ...]
                // if the query is `SELECT name FROM roles`
                return { success: true, roles: results };
            } catch (error: any) {
                console.error("Error listing roles:", error);
                // Ensure the return type matches what might be expected by Zod schema if used for validation client-side
                return { success: false, message: 'Failed to fetch roles due to an internal error.', roles: [] as {name: string}[] };
            }
        }
    })
}; 