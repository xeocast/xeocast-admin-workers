import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';

// --- Schemas ---

const YoutubePlaylistBaseSchema = {
    youtube_platform_id: z.string().min(1, { message: 'YouTube Platform ID is required' }).max(255),
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    description: z.string().max(5000).optional().nullable(), // TEXT can be long
    channel_id: z.number().int().positive({ message: 'Channel ID must be a positive integer' }),
    series_id: z.number().int().positive({ message: 'Series ID must be a positive integer' }),
};

const CreateYoutubePlaylistSchema = z.object(YoutubePlaylistBaseSchema);

const UpdateYoutubePlaylistSchema = z.object({
    id: z.number().int().positive({ message: 'Invalid YouTube Playlist ID' }),
    ...YoutubePlaylistBaseSchema,
});

const ALL_YOUTUBE_PLAYLIST_FIELDS = 'id, youtube_platform_id, title, description, channel_id, series_id, created_at, updated_at';

// --- Actions ---

export const youtubePlaylists = {
    // --- CREATE --- //
    createYoutubePlaylist: defineAction({
        accept: 'form',
        input: CreateYoutubePlaylistSchema,
        handler: async (
            input: z.infer<typeof CreateYoutubePlaylistSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;
            try {
                // Validate channel_id
                const channelExists = await db.prepare('SELECT id FROM youtube_channels WHERE id = ?').bind(input.channel_id).first();
                if (!channelExists) {
                    return { success: false, message: `YouTube Channel with ID ${input.channel_id} not found.` };
                }

                // Validate series_id
                const seriesExists = await db.prepare('SELECT id FROM series WHERE id = ?').bind(input.series_id).first();
                if (!seriesExists) {
                    return { success: false, message: `Series with ID ${input.series_id} not found.` };
                }

                const result = await db.prepare(
                    `INSERT INTO youtube_playlists (
                        youtube_platform_id, title, description, channel_id, series_id
                    ) VALUES (?, ?, ?, ?, ?)`
                )
                .bind(
                    input.youtube_platform_id, input.title, input.description, input.channel_id, input.series_id
                )
                .run();

                const newPlaylistId = result.meta?.last_row_id;
                return { success: true, message: 'YouTube Playlist created successfully.', playlistId: newPlaylistId };
            } catch (error: any) {
                console.error("Error creating YouTube Playlist:", error);
                if (error.message?.includes('UNIQUE constraint failed: youtube_playlists.youtube_platform_id')) {
                    return { success: false, message: 'YouTube Playlist with this Platform ID already exists.' };
                }
                if (error.message?.includes('FOREIGN KEY constraint failed')) {
                     return { success: false, message: 'Invalid YouTube Channel ID or Series ID provided.' };
                }
                return { success: false, message: 'Failed to create YouTube Playlist.' };
            }
        }
    }),

    // --- READ (All) --- //
    listYoutubePlaylists: defineAction({
        handler: async (_, context: ActionAPIContext) => {
            const db = context.locals.runtime.env.DB;
            try {
                const { results } = await db.prepare(
                    `SELECT ${ALL_YOUTUBE_PLAYLIST_FIELDS} FROM youtube_playlists ORDER BY title ASC`
                ).all();
                return { success: true, playlists: results };
            } catch (error) {
                console.error("Error listing YouTube Playlists:", error);
                return { success: false, message: 'Failed to fetch YouTube Playlists.', playlists: [] };
            }
        }
    }),

    // --- READ (Single by ID) --- //
    getYoutubePlaylistById: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB;
            try {
                const playlist = await db.prepare(
                    `SELECT ${ALL_YOUTUBE_PLAYLIST_FIELDS} FROM youtube_playlists WHERE id = ?`
                )
                .bind(id)
                .first();

                if (!playlist) {
                    return { success: false, message: 'YouTube Playlist not found.', playlist: null };
                }
                return { success: true, playlist };
            } catch (error) {
                console.error(`Error fetching YouTube Playlist ${input.id}:`, error);
                return { success: false, message: 'Failed to fetch YouTube Playlist.', playlist: null };
            }
        }
    }),

    // --- UPDATE --- //
    updateYoutubePlaylist: defineAction({
        accept: 'form',
        input: UpdateYoutubePlaylistSchema,
        handler: async (
            input: z.infer<typeof UpdateYoutubePlaylistSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;

            try {
                 // Validate channel_id
                const channelExists = await db.prepare('SELECT id FROM youtube_channels WHERE id = ?').bind(input.channel_id).first();
                if (!channelExists) {
                    return { success: false, message: `YouTube Channel with ID ${input.channel_id} not found.` };
                }

                // Validate series_id
                const seriesExists = await db.prepare('SELECT id FROM series WHERE id = ?').bind(input.series_id).first();
                if (!seriesExists) {
                    return { success: false, message: `Series with ID ${input.series_id} not found.` };
                }

                const result = await db.prepare(
                    `UPDATE youtube_playlists SET
                        youtube_platform_id = ?, title = ?, description = ?, channel_id = ?, series_id = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?`
                )
                .bind(
                    input.youtube_platform_id, input.title, input.description, input.channel_id, input.series_id,
                    input.id
                )
                .run();

                if (result.meta.changes === 0) {
                    return { success: false, message: 'YouTube Playlist not found or no changes made.' };
                }

                return { success: true, message: 'YouTube Playlist updated successfully.' };
            } catch (error: any) {
                console.error(`Error updating YouTube Playlist ${input.id}:`, error);
                if (error.message?.includes('UNIQUE constraint failed: youtube_playlists.youtube_platform_id')) {
                    return { success: false, message: 'YouTube Playlist with this Platform ID already exists for another playlist.' };
                }
                if (error.message?.includes('FOREIGN KEY constraint failed')) {
                     return { success: false, message: 'Invalid YouTube Channel ID or Series ID provided.' };
                }
                return { success: false, message: 'Failed to update YouTube Playlist.' };
            }
        }
    }),

    // --- DELETE --- //
    deleteYoutubePlaylist: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            input: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = input;
            const db = context.locals.runtime.env.DB;
            try {
                // Check if any series are associated with this playlist - THIS CHECK IS NO LONGER VALID WITH NEW SCHEMA
                // const seriesCheck = await db.prepare(
                // 'SELECT id FROM series WHERE youtube_playlist_id = ?'
                // ).bind(id).first();

                // if (seriesCheck) {
                // return { success: false, message: 'Cannot delete playlist. It is currently associated with one or more series. Please update or delete those series first.' };
                // }


                const result = await db.prepare(
                    'DELETE FROM youtube_playlists WHERE id = ?'
                )
                .bind(id)
                .run();

                if (result.meta.changes === 0) {
                    return { success: false, message: 'YouTube Playlist not found.' };
                }
                return { success: true, message: 'YouTube Playlist deleted successfully.' };
            } catch (error: any) {
                console.error(`Error deleting YouTube Playlist ${id}:`, error);
                // Check for foreign key constraint violation if a series still references it (should be caught by the check above, but as a fallback)
                if (error.message?.includes('FOREIGN KEY constraint failed')) {
                    return { success: false, message: 'Cannot delete playlist. It is referenced by other records. Please remove those references first.' };
                }
                return { success: false, message: 'Failed to delete YouTube Playlist.' };
            }
        }
    })
};
