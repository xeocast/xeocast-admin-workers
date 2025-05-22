import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';

// --- Schemas ---

const SeriesBaseSchema = {
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    description: z.string().max(5000).optional().nullable(), // TEXT can be long, 5000 is a guess
    category_id: z.number().int().positive({ message: 'Category ID must be a positive integer' }),
    // youtube_playlist_id: z.number().int().positive().optional().nullable(), // Removed as per new schema
};

const CreateSeriesSchema = z.object(SeriesBaseSchema);

const UpdateSeriesSchema = z.object({
    id: z.number().int().positive({ message: 'Invalid Series ID' }),
    ...SeriesBaseSchema,
});

const ALL_SERIES_FIELDS = 'id, title, description, category_id, created_at, updated_at'; // Removed youtube_playlist_id

// --- Actions ---

export const series = {
    // --- CREATE --- //
    createSeries: defineAction({
        accept: 'form',
        input: CreateSeriesSchema,
        handler: async (
            input: z.infer<typeof CreateSeriesSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB; // Reverted to original correct access
            try {
                // Validate category_id
                const categoryExists = await db.prepare('SELECT id FROM categories WHERE id = ?').bind(input.category_id).first();
                if (!categoryExists) {
                    return { success: false, message: `Category with ID ${input.category_id} not found.` };
                }

                // Removed youtube_playlist_id validation as it's not in the series table directly

                const result = await db.prepare(
                    `INSERT INTO series (
                        title, description, category_id
                    ) VALUES (?, ?, ?)`
                )
                .bind(
                    input.title, input.description, input.category_id
                )
                .run();

                const newSeriesId = result.meta?.last_row_id;
                if (!newSeriesId) {
                    return { success: false, message: 'Failed to create series: could not retrieve ID.' };
                }
                
                // Fetch the newly created series to return it
                const newSeries = await db.prepare(
                    `SELECT ${ALL_SERIES_FIELDS} FROM series WHERE id = ?`
                ).bind(newSeriesId).first();

                return { success: true, message: 'Series created successfully.', series: newSeries };
            } catch (error: any) {
                console.error("Error creating series:", error);
                if (error.message?.includes('UNIQUE constraint failed: series.title')) { // Assuming title should be unique, though not specified in schema
                    return { success: false, message: 'Series title already exists.' };
                }
                if (error.message?.includes('FOREIGN KEY constraint failed')) {
                     return { success: false, message: 'Invalid Category ID provided.' }; // Updated message
                }
                return { success: false, message: 'Failed to create series.' };
            }
        }
    }),

    // --- READ (All) --- //
    listSeries: defineAction({
        input: z.object({ categoryId: z.number().int().positive().optional() }).optional(),
        handler: async (input, context: ActionAPIContext) => {
            const db = context.locals.runtime.env.DB; // Reverted to original correct access
            const categoryId = input?.categoryId;

            try {
                let query = `SELECT ${ALL_SERIES_FIELDS} FROM series`;
                const params = [];

                if (categoryId) {
                    query += ' WHERE category_id = ?';
                    params.push(categoryId);
                }

                query += ' ORDER BY title ASC';

                const { results } = await db.prepare(query).bind(...params).all();
                return { success: true, series: results };
            } catch (error) {
                console.error("Error listing series:", error);
                return { success: false, message: 'Failed to fetch series.', series: [] };
            }
        }
    }),

    // --- READ (Single by ID) --- //
    getSeriesById: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB; // Reverted to original correct access
            try {
                const singleSeries = await db.prepare(
                    `SELECT ${ALL_SERIES_FIELDS} FROM series WHERE id = ?`
                )
                .bind(id)
                .first();

                if (!singleSeries) {
                    return { success: false, message: 'Series not found.', series: null };
                }
                return { success: true, series: singleSeries };
            } catch (error) {
                console.error(`Error fetching series ${id}:`, error);
                return { success: false, message: 'Failed to fetch series.', series: null };
            }
        }
    }),

    // --- UPDATE --- //
    updateSeries: defineAction({
        accept: 'form',
        input: UpdateSeriesSchema,
        handler: async (
            input: z.infer<typeof UpdateSeriesSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB; // Reverted to original correct access

            try {
                 // Validate category_id
                const categoryExists = await db.prepare('SELECT id FROM categories WHERE id = ?').bind(input.category_id).first();
                if (!categoryExists) {
                    return { success: false, message: `Category with ID ${input.category_id} not found.` };
                }

                // Removed youtube_playlist_id validation

                // Check if the series to update exists
                const existingSeries = await db.prepare('SELECT id FROM series WHERE id = ?').bind(input.id).first();
                if (!existingSeries) {
                    return { success: false, message: `Series with ID ${input.id} not found.` };
                }

                const result = await db.prepare(
                    `UPDATE series SET 
                        title = ?, description = ?, category_id = ?,
                        updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?`
                )
                .bind(
                    input.title, input.description, input.category_id,
                    input.id
                )
                .run();

                if (result.meta.changes === 0) {
                    // This might happen if the data is identical, or the ID was not found (though we checked above)
                    // To provide a more accurate message, we can re-fetch and compare, or assume ID was found.
                    // For now, let's assume if changes is 0, it's because no data was actually changed.
                    return { success: true, message: 'No changes made to the series.' };
                }
                
                // Fetch the updated series to return it
                const updatedSeries = await db.prepare(
                    `SELECT ${ALL_SERIES_FIELDS} FROM series WHERE id = ?`
                ).bind(input.id).first();

                return { success: true, message: 'Series updated successfully.', series: updatedSeries };
            } catch (error: any) {
                console.error(`Error updating series ${input.id}:`, error);
                if (error.message?.includes('UNIQUE constraint failed: series.title')) { // Assuming title should be unique
                    return { success: false, message: 'Series title already exists.' };
                }
                if (error.message?.includes('FOREIGN KEY constraint failed')) {
                     // This could be due to category_id or youtube_playlist_id
                     // Also, a trigger prevents changing category_id if podcasts are associated
                     if (error.message?.includes('Podcast category_id must match the category_id of the series') || error.message?.includes('Cannot change category of a series with podcasts')) {
                        return { success: false, message: error.message }; // Return the specific trigger message
                     }
                     return { success: false, message: 'Invalid Category ID provided, or category change restricted.' }; // Updated message
                }
                return { success: false, message: 'Failed to update series.' };
            }
        }
    }),

    // --- DELETE --- //
    deleteSeries: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB; // Reverted to original correct access
            try {
                // Check if the series to delete exists
                const existingSeries = await db.prepare('SELECT id FROM series WHERE id = ?').bind(id).first();
                if (!existingSeries) {
                    return { success: false, message: `Series with ID ${id} not found.` };
                }

                const result = await db.prepare('DELETE FROM series WHERE id = ?').bind(id).run();

                if (result.meta.changes === 0) {
                     // This case should ideally be caught by the check above
                    return { success: false, message: 'Series not found or no changes made.' };
                }
                return { success: true, message: 'Series deleted successfully.' };
            } catch (error: any) {
                console.error(`Error deleting series ${id}:`, error);
                 if (error.message?.includes('FOREIGN KEY constraint failed')) {
                    // This implies there are podcasts associated with this series
                    return { success: false, message: 'Cannot delete series. It is currently assigned to one or more podcasts.' };
                 }
                return { success: false, message: 'Failed to delete series.' };
            }
        }
    })
};
