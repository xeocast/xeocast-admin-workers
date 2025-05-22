import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';

// --- Schemas ---

const YoutubeChannelBaseSchema = {
    category_id: z.number().int().positive({ message: 'Category ID is required' }),
    youtube_platform_id: z.string().min(1, { message: 'YouTube Channel ID is required' }).max(255),
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    description: z.string().min(1, { message: 'Description is required' }).max(5000),
    youtube_platform_category_id: z.string().min(1, { message: 'YouTube Platform Category ID is required' }),
    video_description_template: z.string().min(1, { message: 'Video Description Template is required' }),
    first_comment_template: z.string().min(1, { message: 'First Comment Template is required' }),
    language_code: z.string().length(2, { message: 'Language code must be 2 characters' }),
};

export const CreateYoutubeChannelSchema = z.object(YoutubeChannelBaseSchema);

const UpdateYoutubeChannelSchema = z.object({
    id: z.number().int().positive({ message: 'Invalid YouTube Channel DB ID' }),
    ...YoutubeChannelBaseSchema,
});

const ALL_YOUTUBE_CHANNEL_FIELDS = 'id, category_id, youtube_platform_id, youtube_platform_category_id, title, description, video_description_template, first_comment_template, language_code, created_at, updated_at';

// --- Actions ---

export const youtubeChannels = {
    // --- CREATE --- //
    createYoutubeChannel: defineAction({
        accept: 'form',
        input: CreateYoutubeChannelSchema,
        handler: async (
            input: z.infer<typeof CreateYoutubeChannelSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;
            try {
                const result = await db.prepare(
                    `INSERT INTO youtube_channels (
                        category_id, youtube_platform_id, title, description, youtube_platform_category_id, 
                        video_description_template, first_comment_template, language_code
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                )
                .bind(
                    input.category_id, input.youtube_platform_id, input.title, input.description, 
                    input.youtube_platform_category_id, input.video_description_template, 
                    input.first_comment_template, input.language_code
                )
                .run();

                const newChannelDbId = result.meta?.last_row_id;
                if (!newChannelDbId) {
                    console.error("Error creating YouTube channel: last_row_id is not available", result);
                    return { success: false, message: 'Failed to create YouTube channel due to missing ID.' };
                }
                console.log('YouTube Channel created with DB ID:', newChannelDbId);
                return { success: true, message: 'YouTube Channel created successfully.', channelDbId: newChannelDbId };
            } catch (error: any) {
                console.error("Error creating YouTube channel:", error);
                if (error.message?.includes('UNIQUE constraint failed: youtube_channels.youtube_platform_id')) {
                    return { success: false, message: 'This YouTube Channel ID already exists.' };
                }
                return { success: false, message: 'Failed to create YouTube channel.' };
            }
        }
    }),

    // --- READ (All) --- //
    listYoutubeChannels: defineAction({
        handler: async (_, context: ActionAPIContext) => {
            const db = context.locals.runtime.env.DB;
            try {
                const { results } = await db.prepare(
                    `SELECT ${ALL_YOUTUBE_CHANNEL_FIELDS} FROM youtube_channels ORDER BY title ASC`
                ).all();
                return { success: true, channels: results };
            } catch (error) {
                console.error("Error listing YouTube channels:", error);
                return { success: false, message: 'Failed to fetch YouTube channels.', channels: [] };
            }
        }
    }),

    // --- READ (Single by DB ID) --- //
    getYoutubeChannelById: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB;
            try {
                const channel = await db.prepare(
                    `SELECT ${ALL_YOUTUBE_CHANNEL_FIELDS} FROM youtube_channels WHERE id = ?`
                )
                .bind(id)
                .first();

                if (!channel) {
                    return { success: false, message: 'YouTube Channel not found.', channel: null };
                }
                return { success: true, channel };
            } catch (error) {
                console.error(`Error fetching YouTube channel ${id}:`, error);
                return { success: false, message: 'Failed to fetch YouTube channel.', channel: null };
            }
        }
    }),
    
    // --- READ (Single by YouTube Channel ID) --- //
    getYoutubeChannelByChannelId: defineAction({
        input: z.object({ youtube_platform_id: z.string().min(1) }),
        handler: async (
            input: { youtube_platform_id: string },
            context: ActionAPIContext
        ) => {
            const { youtube_platform_id } = input;
            const db = context.locals.runtime.env.DB;
            try {
                const channel = await db.prepare(
                    `SELECT ${ALL_YOUTUBE_CHANNEL_FIELDS} FROM youtube_channels WHERE youtube_platform_id = ?`
                )
                .bind(youtube_platform_id)
                .first();

                if (!channel) {
                    return { success: false, message: 'YouTube Channel not found.', channel: null };
                }
                return { success: true, channel };
            } catch (error) {
                console.error(`Error fetching YouTube channel with youtube_platform_id ${youtube_platform_id}:`, error);
                return { success: false, message: 'Failed to fetch YouTube channel.', channel: null };
            }
        }
    }),

    // --- UPDATE --- //
    updateYoutubeChannel: defineAction({
        accept: 'form',
        input: UpdateYoutubeChannelSchema,
        handler: async (
            input: z.infer<typeof UpdateYoutubeChannelSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;

            try {
                const result = await db.prepare(
                    `UPDATE youtube_channels SET 
                        category_id = ?, youtube_platform_id = ?, title = ?, description = ?, 
                        youtube_platform_category_id = ?, video_description_template = ?, 
                        first_comment_template = ?, language_code = ?, 
                        updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?`
                )
                .bind(
                    input.category_id, input.youtube_platform_id, input.title, input.description,
                    input.youtube_platform_category_id, input.video_description_template,
                    input.first_comment_template, input.language_code,
                    input.id
                )
                .run();

                if (result.meta.changes === 0) {
                     const existingChannel = await db.prepare('SELECT id FROM youtube_channels WHERE id = ?').bind(input.id).first();
                    if (!existingChannel) {
                        return { success: false, message: 'YouTube Channel not found.' };
                    }
                    // Potentially, no actual values changed, or the youtube_platform_id/custom_url caused a unique constraint violation attempt that wasn't caught if the value was the same as another record.
                    // For simplicity, we'll assume if changes is 0 and record exists, no values were different.
                    return { success: true, message: 'No changes detected for the YouTube Channel.' };
                }

                console.log(`YouTube Channel ${input.id} updated:`, result);
                return { success: true, message: 'YouTube Channel updated successfully.' };
            } catch (error: any) {
                console.error(`Error updating YouTube channel ${input.id}:`, error);
                if (error.message?.includes('UNIQUE constraint failed: youtube_channels.youtube_platform_id')) {
                    return { success: false, message: 'This YouTube Channel ID already exists for another channel.' };
                }
                return { success: false, message: 'Failed to update YouTube channel.' };
            }
        }
    }),

    // --- DELETE --- //
    deleteYoutubeChannel: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB;
            try {
                // Check if this channel is referenced by any youtube_videos
                const referencingYoutubeVideos = await db.prepare(
                    'SELECT id FROM youtube_videos WHERE youtube_channel_id = ?'
                ).bind(id).all();

                if (referencingYoutubeVideos && referencingYoutubeVideos.results && referencingYoutubeVideos.results.length > 0) {
                    return { 
                        success: false, 
                        message: `Cannot delete YouTube Channel. It is referenced by ${referencingYoutubeVideos.results.length} YouTube video record${referencingYoutubeVideos.results.length > 1 ? 's' : ''}. Please delete these video records first.`
                    };
                }
                
                const result = await db.prepare('DELETE FROM youtube_channels WHERE id = ?').bind(id).run();

                if (result.meta.changes === 0) {
                    return { success: false, message: 'YouTube Channel not found.' };
                }
                console.log(`YouTube Channel ${id} deleted`);
                return { success: true, message: 'YouTube Channel deleted successfully.' };
            } catch (error: any) {
                console.error(`Error deleting YouTube channel ${id}:`, error);
                // Note: D1 might not give specific FOREIGN KEY constraint error messages by default
                // The checks above are more user-friendly.
                return { success: false, message: 'Failed to delete YouTube channel. It might be in use.' };
            }
        }
    })
};

// Also need to export these actions in src/actions/index.ts
