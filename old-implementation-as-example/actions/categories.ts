import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';

// --- Schemas ---

const CategoryBaseSchema = {
    name: z.string().min(1, { message: 'Name is required' }).max(255),
    description: z.string().min(1, { message: 'Description is required' }).max(5000), // Schema has TEXT NOT NULL
    default_source_background_bucket_key: z.string().min(1, {message: 'Default background key is required'}),
    default_source_thumbnail_bucket_key: z.string().min(1, {message: 'Default thumbnail key is required'}),
    prompt_template_to_gen_evergreen_titles: z.string().min(1, {message: 'Evergreen titles prompt is required'}),
    prompt_template_to_gen_news_titles: z.string().min(1, {message: 'News titles prompt is required'}),
    prompt_template_to_gen_series_titles: z.string().min(1, {message: 'Series titles prompt is required'}),
    prompt_template_to_gen_article_content: z.string().min(1, {message: 'Article content prompt is required'}),
    prompt_template_to_gen_description: z.string().min(1, {message: 'Description prompt is required'}),
    prompt_template_to_gen_short_description: z.string().min(1, {message: 'Short description prompt is required'}),
    prompt_template_to_gen_tag_list: z.string().min(1, {message: 'Tag list prompt is required'}),
    prompt_template_to_gen_audio_podcast: z.string().min(1, {message: 'Audio podcast prompt is required'}),
    prompt_template_to_gen_video_thumbnail: z.string().min(1, {message: 'Video thumbnail prompt is required'}),
    prompt_template_to_gen_article_image: z.string().min(1, {message: 'Article image prompt is required'}),
    language_code: z.string().length(2, { message: 'Language code must be 2 characters' }),
};

const CreateCategorySchema = z.object(CategoryBaseSchema);

const UpdateCategorySchema = z.object({
    id: z.number().int().positive({ message: 'Invalid Category ID' }),
    ...CategoryBaseSchema,
});

const ALL_CATEGORY_FIELDS = 'id, name, description, default_source_background_bucket_key, default_source_thumbnail_bucket_key, prompt_template_to_gen_evergreen_titles, prompt_template_to_gen_news_titles, prompt_template_to_gen_series_titles, prompt_template_to_gen_article_content, prompt_template_to_gen_description, prompt_template_to_gen_short_description, prompt_template_to_gen_tag_list, prompt_template_to_gen_audio_podcast, prompt_template_to_gen_video_thumbnail, prompt_template_to_gen_article_image, language_code, created_at, updated_at';

// --- Actions ---

export const categories = {
    // --- CREATE --- //
    createCategory: defineAction({
        accept: 'form',
        input: CreateCategorySchema,
        handler: async (
            input: z.infer<typeof CreateCategorySchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;
            try {
                const result = await db.prepare(
                    `INSERT INTO categories (
                        name, description, default_source_background_bucket_key, default_source_thumbnail_bucket_key,
                        prompt_template_to_gen_evergreen_titles, prompt_template_to_gen_news_titles,
                        prompt_template_to_gen_series_titles, prompt_template_to_gen_article_content,
                        prompt_template_to_gen_description, prompt_template_to_gen_short_description,
                        prompt_template_to_gen_tag_list, prompt_template_to_gen_audio_podcast,
                        prompt_template_to_gen_video_thumbnail, prompt_template_to_gen_article_image,
                        language_code
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                )
                .bind(
                    input.name, input.description, input.default_source_background_bucket_key, input.default_source_thumbnail_bucket_key,
                    input.prompt_template_to_gen_evergreen_titles, input.prompt_template_to_gen_news_titles,
                    input.prompt_template_to_gen_series_titles, input.prompt_template_to_gen_article_content,
                    input.prompt_template_to_gen_description, input.prompt_template_to_gen_short_description,
                    input.prompt_template_to_gen_tag_list, input.prompt_template_to_gen_audio_podcast,
                    input.prompt_template_to_gen_video_thumbnail, input.prompt_template_to_gen_article_image,
                    input.language_code
                )
                .run();

                console.log('Category created:', result);
                const newCategoryId = result.meta?.last_row_id;
                return { success: true, message: 'Category created successfully.', categoryId: newCategoryId };
            } catch (error: any) {
                console.error("Error creating category:", error);
                if (error.message?.includes('UNIQUE constraint failed: categories.name')) {
                    return { success: false, message: 'Category name already exists.' };
                }
                return { success: false, message: 'Failed to create category.' };
            }
        }
    }),

    // --- READ (All) --- //
    listCategories: defineAction({
        handler: async (_, context: ActionAPIContext) => {
            const db = context.locals.runtime.env.DB;
            try {
                const { results } = await db.prepare(
                    `SELECT id, name, language_code FROM categories ORDER BY name ASC`
                ).all<{ id: number; name: string; language_code: string }>();
                
                return { success: true, categories: results || [] };
            } catch (error: any) {
                console.error("Error listing categories:", error.message);
                return { success: false, message: `Failed to fetch categories: ${error.message}`, categories: [] };
            }
        }
    }),

    // --- READ (Single by ID) --- //
    getCategoryById: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB;
            try {
                const category = await db.prepare(
                    `SELECT ${ALL_CATEGORY_FIELDS} FROM categories WHERE id = ?`
                )
                .bind(id)
                .first();

                if (!category) {
                    return { success: false, message: 'Category not found.', category: null };
                }
                return { success: true, category };
            } catch (error) {
                console.error(`Error fetching category ${input.id}:`, error);
                return { success: false, message: 'Failed to fetch category.', category: null };
            }
        }
    }),

    // --- UPDATE --- //
    updateCategory: defineAction({
        accept: 'form',
        input: UpdateCategorySchema,
        handler: async (
            input: z.infer<typeof UpdateCategorySchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;

            try {
                const result = await db.prepare(
                    `UPDATE categories SET 
                        name = ?, description = ?, default_source_background_bucket_key = ?, default_source_thumbnail_bucket_key = ?,
                        prompt_template_to_gen_evergreen_titles = ?, prompt_template_to_gen_news_titles = ?,
                        prompt_template_to_gen_series_titles = ?, prompt_template_to_gen_article_content = ?,
                        prompt_template_to_gen_description = ?, prompt_template_to_gen_short_description = ?,
                        prompt_template_to_gen_tag_list = ?, prompt_template_to_gen_audio_podcast = ?,
                        prompt_template_to_gen_video_thumbnail = ?, prompt_template_to_gen_article_image = ?,
                        language_code = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?`
                )
                .bind(
                    input.name, input.description, input.default_source_background_bucket_key, input.default_source_thumbnail_bucket_key,
                    input.prompt_template_to_gen_evergreen_titles, input.prompt_template_to_gen_news_titles,
                    input.prompt_template_to_gen_series_titles, input.prompt_template_to_gen_article_content,
                    input.prompt_template_to_gen_description, input.prompt_template_to_gen_short_description,
                    input.prompt_template_to_gen_tag_list, input.prompt_template_to_gen_audio_podcast,
                    input.prompt_template_to_gen_video_thumbnail, input.prompt_template_to_gen_article_image,
                    input.language_code, input.id
                )
                .run();

                if (result.meta.changes === 0) {
                    return { success: false, message: 'Category not found or no changes made.' };
                }

                console.log(`Category ${input.id} updated:`, result);
                return { success: true, message: 'Category updated successfully.' };
            } catch (error: any) {
                console.error(`Error updating category ${input.id}:`, error);
                 if (error.message?.includes('UNIQUE constraint failed: categories.name')) {
                    return { success: false, message: 'Category name already exists.' };
                }
                return { success: false, message: 'Failed to update category.' };
            }
        }
    }),

    // --- DELETE --- //
    deleteCategory: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB;
            try {
                const result = await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

                if (result.meta.changes === 0) {
                    return { success: false, message: 'Category not found.' };
                }
                console.log(`Category ${id} deleted`);
                return { success: true, message: 'Category deleted successfully.' };
            } catch (error: any) {
                console.error(`Error deleting category ${id}:`, error);
                 if (error.message?.includes('FOREIGN KEY constraint failed')) {
                    return { success: false, message: 'Cannot delete category. It is currently assigned to one or more podcasts or series.' };
                 }
                return { success: false, message: 'Failed to delete category.' };
            }
        }
    })
};
