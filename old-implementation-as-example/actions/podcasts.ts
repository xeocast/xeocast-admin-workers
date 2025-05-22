import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'zod';
import type { R2Bucket as CloudflareR2Bucket } from '@cloudflare/workers-types';

// Helper for JSON string validation
// const jsonString = z.string().refine(
//     (val) => {
//         try {
//             JSON.parse(val);
//             return true;
//         } catch (e) {
//             return false;
//         }
//     },
//     { message: 'Must be a valid JSON string' }
// );

// --- Schemas ---

const PodcastBaseSchema = {
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    description: z.string().max(5000).optional().nullable(),
    markdown_content: z.string().optional().nullable(),
    category_id: z.number().int().positive({ message: 'Valid Category ID is required' }),
    series_id: z.number().int().positive().optional().nullable(),
    // Bucket keys
    source_audio_bucket_key: z.string().max(2048).optional().nullable(),
    source_background_bucket_key: z.string().max(2048).optional().nullable(),
    video_bucket_key: z.string().max(2048).optional().nullable(),
    thumbnail_bucket_key: z.string().max(2048).optional().nullable(),
    // Other fields
    tags: z.preprocess(
        (arg) => {
            if (typeof arg !== 'string' || arg.trim() === '') {
                return []; // Normalize empty, null, undefined, or non-string to an empty array
            }
            // Check if it might already be a JSON array string
            // A simple heuristic: starts with [ and ends with ]
            if (arg.startsWith('[') && arg.endsWith(']')) {
                 try {
                    const parsed = JSON.parse(arg);
                    if (Array.isArray(parsed)) {
                        // Ensure all elements are strings if it's already an array
                        return parsed.filter(item => typeof item === 'string');
                    }
                 } catch (e) { /* Fall through to CSV parsing, it wasn't valid JSON */ }
            }
            // Assume comma-separated string if not a valid JSON array string
            return arg.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
        },
        z.array(z.string()) // Expects an array of strings after preprocessing
            .optional() // This array can be optional
            .default([]) // If array is undefined, default to an empty array
            .transform(arr => JSON.stringify(arr)) // THEN transform the array (either from input or default) to a JSON string
    ),
    first_comment: z.string().optional().nullable(),
    type: z.enum(['evergreen', 'news'], { message: 'Type must be evergreen or news' }),
    status: z.enum([
        'draft', 'draftApproved', 'researching', 'researched', 
        'generatingThumbnail', 'thumbnailGenerated', 'generatingAudio', 'audioGenerated', 
        'generating', 'generated', 'generatedApproved', 
        'uploading', 'uploaded', 'published', 'unpublished'
    ], { message: 'Invalid status' }),
    scheduled_publish_at: z.preprocess(
        (arg) => {
            if (arg === "" || arg === undefined || arg === null) {
                return null; // Normalize to null if empty or not provided
            }
            if (typeof arg === 'string') {
                // If coming from datetime-local input (YYYY-MM-DDTHH:MM)
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(arg)) {
                    return arg.replace('T', ' ') + ':00'; // Convert to YYYY-MM-DD HH:MM:00
                }
                // If it's already a parsable date string (could be full ISO, or target format)
                try {
                    const d = new Date(arg); // Try to parse whatever string it is
                    if (!isNaN(d.getTime())) { // Check if it's a valid date
                        const year = d.getFullYear();
                        const month = (d.getMonth() + 1).toString().padStart(2, '0');
                        const day = d.getDate().toString().padStart(2, '0');
                        const hours = d.getHours().toString().padStart(2, '0');
                        const minutes = d.getMinutes().toString().padStart(2, '0');
                        const seconds = d.getSeconds().toString().padStart(2, '0');
                        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                    }
                } catch (e) { /* Not a parsable date string by new Date() */ }
            }
            // If not a recognized/convertible string format or not a string,
            // return the original arg to let Zod's string validation catch it if it's not a string,
            // or the refine step catch it if it's a string but not in the correct final format.
            return arg;
        },
        z.union([
            z.string().refine(
                (val) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val),
                { message: "Scheduled publish date must be in YYYY-MM-DD HH:MM:SS format." }
            ),
            z.null() // Allow null
        ]).optional() // The field itself is optional. .default(null) is implicit for optional null unions.
    ),
};

// Schema for creating a podcast
const CreatePodcastSchema = z.object(PodcastBaseSchema);

// Schema for updating a podcast
const UpdatePodcastSchema = z.object({
    id: z.number().int().positive({ message: 'Invalid Podcast ID' }),
    ...PodcastBaseSchema,
});

// Schema for listing podcasts with filters
const ListPodcastsFiltersSchema = z.object({
	searchText: z.string().optional(),
	categoryId: z.number().int().positive().optional(),
	seriesId: z.number().int().positive().optional(),
	type: z.enum(['evergreen', 'news']).optional(),
	status: z.enum([
        'draft', 'draftApproved', 'researching', 'researched', 
        'generatingThumbnail', 'thumbnailGenerated', 'generatingAudio', 'audioGenerated', 
        'generating', 'generated', 'generatedApproved', 
        'uploading', 'uploaded', 'published', 'unpublished'
    ]).optional(),
	dateFrom: z.string().datetime({ message: "Invalid 'from' date string" }).optional().nullable(),
	dateTo: z.string().datetime({ message: "Invalid 'to' date string" }).optional().nullable(),
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().optional().default(20),
}).optional();

// Schema for audio file upload
const UploadPodcastAudioSchema = z.object({
    podcastId: z.number().int().positive({ message: 'Invalid Podcast ID' }),
    audioFile: z.instanceof(File, { message: 'Audio file is required.' })
        .refine(file => file.size > 0, { message: 'Audio file cannot be empty.' })
        .refine(file => file.type.startsWith('audio/'), { message: 'File must be an audio type.' }),
});

// Schema for background media file (image/video) upload

// Schema for R2 object streaming
const StreamR2ObjectSchema = z.object({
    key: z.string().min(1, { message: 'R2 object key is required.' }),
    bucketType: z.enum([
        'VIDEO_OUTPUT_BUCKET',
        'VIDEO_SOURCE_BUCKET',
        'AUDIO_SOURCE_BUCKET', // Corresponds to uploadPodcastAudio's bucket
        'BACKGROUND_SOURCE_BUCKET', // Corresponds to uploadBackgroundFile's bucket
        'THUMBNAIL_OUTPUT_BUCKET' // Assuming thumbnails might also be in VIDEO_OUTPUT_BUCKET or a separate one
    ], { message: 'Invalid bucket type specified.' }),
    filename: z.string().min(1, { message: 'Filename is required for download.' }),
});

const UploadBackgroundMediaSchema = z.object({
    podcastId: z.number().int().positive({ message: 'Invalid Podcast ID' }),
    mediaFile: z.instanceof(File, { message: 'Media file is required.' })
        .refine(file => file.size > 0, { message: 'Media file cannot be empty.' })
        .refine(file => file.type.startsWith('image/') || file.type.startsWith('video/'), { message: 'File must be an image or video type.' }),
});

const ALL_PODCAST_FIELDS = `
    p.id, p.title, p.description, p.markdown_content,
    p.source_audio_bucket_key, p.source_background_bucket_key, p.video_bucket_key, p.thumbnail_bucket_key,
    p.category_id, p.series_id, p.tags, p.first_comment, p.type, p.status, p.scheduled_publish_at,
    p.last_status_change_at, p.created_at, p.updated_at,
    c.name as category_name
`;
// s.title as series_title can be added if series join is included

// --- Actions ---

export const podcasts = {
    // --- CREATE --- //
    createPodcast: defineAction({
        accept: 'form',
        input: CreatePodcastSchema,
        handler: async (
            input: z.infer<typeof CreatePodcastSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;

            try {
                // Validate category_id exists
                const categoryExists = await db.prepare('SELECT id FROM categories WHERE id = ?').bind(input.category_id).first();
                if (!categoryExists) {
                    return { success: false, message: 'Invalid Category ID.' };
                }

                // Validate series_id exists if provided
                if (input.series_id) {
                    const seriesExists = await db.prepare('SELECT id FROM series WHERE id = ?').bind(input.series_id).first();
                    if (!seriesExists) {
                        return { success: false, message: 'Invalid Series ID.' };
                    }
                    // Additional check: series category must match podcast category
                    const seriesDetails = await db.prepare('SELECT category_id FROM series WHERE id = ?').bind(input.series_id).first<{category_id: number}>();
                    if (seriesDetails && seriesDetails.category_id !== input.category_id) {
                        return { success: false, message: 'Podcast category must match the series category.'};
                    }
                }

                const result = await db.prepare(
                    `INSERT INTO podcasts (
                        title, description, markdown_content, category_id, series_id,
                        source_audio_bucket_key, source_background_bucket_key, video_bucket_key, thumbnail_bucket_key,
                        tags, first_comment, type, status, scheduled_publish_at, last_status_change_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
                )
                .bind(
                    input.title, input.description, input.markdown_content, input.category_id, input.series_id,
                    input.source_audio_bucket_key, input.source_background_bucket_key, input.video_bucket_key, input.thumbnail_bucket_key,
                    input.tags, input.first_comment, input.type, input.status, input.scheduled_publish_at
                )
                .run();

                console.log('Podcast created:', result);
                const insertedId = result.meta?.last_row_id;
                return { success: true, message: 'Podcast created successfully.', podcastId: insertedId };
            } catch (error: any) {
                console.error("Error creating podcast:", error);
                if (error.message?.includes('FOREIGN KEY constraint failed')) {
                    return { success: false, message: 'Invalid Category or Series ID provided, or category mismatch.' };
                }
                if (error.message?.includes('CHECK constraint failed: type') || error.message?.includes('CHECK constraint failed: status')) {
                    return { success: false, message: 'Invalid type or status value.' };
                }
                 if (error.message?.includes('CHECK constraint failed: json_valid(tags)')) {
                    return { success: false, message: 'Tags must be a valid JSON string.' };
                }
                return { success: false, message: 'Failed to create podcast.' };
            }
        }
    }),

    // --- READ (All) --- //
    listPodcasts: defineAction({
        input: ListPodcastsFiltersSchema,
        handler: async (filters, context: ActionAPIContext) => {
            const db = context.locals.runtime.env.DB;
            const page = filters?.page || 1;
            const limit = filters?.limit || 20;
            const offset = (page - 1) * limit;

            try {
                let baseQuery = `
                    FROM podcasts p
                    JOIN categories c ON p.category_id = c.id
                    LEFT JOIN series s ON p.series_id = s.id
                `;
                const conditions: string[] = [];
                const params: any[] = [];
                const countParams: any[] = []; // Params for count query

                if (filters) {
                    if (filters.searchText) {
                        const searchPattern = `%${filters.searchText}%`;
                        conditions.push(`(p.title LIKE ? OR p.description LIKE ? OR c.name LIKE ? OR s.title LIKE ?)`);
                        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
                        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
                    }
                    if (filters.categoryId) {
                        conditions.push('p.category_id = ?');
                        params.push(filters.categoryId);
                        countParams.push(filters.categoryId);
                    }
                    if (filters.seriesId) {
                        conditions.push('p.series_id = ?');
                        params.push(filters.seriesId);
                        countParams.push(filters.seriesId);
                    }
                    if (filters.type) {
                        conditions.push('p.type = ?');
                        params.push(filters.type);
                        countParams.push(filters.type);
                    }
                    if (filters.status) {
                        conditions.push('p.status = ?');
                        params.push(filters.status);
                        countParams.push(filters.status);
                    }
                    if (filters.dateFrom) {
                        conditions.push('p.created_at >= ?');
                        params.push(filters.dateFrom);
                        countParams.push(filters.dateFrom);
                    }
                    if (filters.dateTo) {
                        conditions.push('p.created_at <= ?');
                        params.push(filters.dateTo);
                        countParams.push(filters.dateTo);
                    }
                }

                let whereClause = '';
                if (conditions.length > 0) {
                    whereClause = ' WHERE ' + conditions.join(' AND ');
                }

                // Query for total count
                const countQuery = `SELECT COUNT(*) as totalCount ${baseQuery} ${whereClause}`;
                const countResult = await db.prepare(countQuery).bind(...countParams).first<{ totalCount: number }>();
                const totalCount = countResult?.totalCount || 0;
                const totalPages = Math.ceil(totalCount / limit);

                // Query for paginated results
                const dataQuery = `
                    SELECT ${ALL_PODCAST_FIELDS}, s.title as series_title
                    ${baseQuery}
                    ${whereClause}
                    ORDER BY p.created_at DESC
                    LIMIT ? OFFSET ?
                `;
                params.push(limit, offset);
                
                const { results } = await db.prepare(dataQuery).bind(...params).all();
                
                return { 
                    success: true, 
                    podcasts: results,
                    currentPage: page,
                    totalPages,
                    limit,
                    totalCount
                };
            } catch (error) {
                console.error("Error listing podcasts:", error);
                return { 
                    success: false, 
                    message: 'Failed to fetch podcasts.', 
                    podcasts: [],
                    currentPage: 1,
                    totalPages: 0,
                    limit,
                    totalCount: 0
                };
            }
        }
    }),

    // --- READ (Single by ID) --- //
    getPodcastById: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            inputParam: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = inputParam;
            const db = context.locals.runtime.env.DB;
            try {
                const podcast = await db.prepare(`
                    SELECT ${ALL_PODCAST_FIELDS}, s.title as series_title
                    FROM podcasts p
                    JOIN categories c ON p.category_id = c.id
                    LEFT JOIN series s ON p.series_id = s.id
                    WHERE p.id = ?
                `)
                .bind(id)
                .first();

                if (!podcast) {
                    return { success: false, message: 'Podcast not found.', podcast: null };
                }
                return { success: true, podcast };
            } catch (error) {
                console.error(`Error fetching podcast ${id}:`, error);
                return { success: false, message: 'Failed to fetch podcast.', podcast: null };
            }
        }
    }),

    // --- UPDATE --- //
    updatePodcast: defineAction({
        accept: 'form',
        input: UpdatePodcastSchema,
        handler: async (
            input: z.infer<typeof UpdatePodcastSchema>,
            context: ActionAPIContext
        ) => {
            const db = context.locals.runtime.env.DB;

            try {
                 // Validate category_id exists
                const categoryExists = await db.prepare('SELECT id FROM categories WHERE id = ?').bind(input.category_id).first();
                if (!categoryExists) {
                    return { success: false, message: 'Invalid Category ID.' };
                }

                // Validate series_id exists if provided
                if (input.series_id) {
                    const seriesExists = await db.prepare('SELECT id FROM series WHERE id = ?').bind(input.series_id).first();
                    if (!seriesExists) {
                        return { success: false, message: 'Invalid Series ID.' };
                    }
                     // Additional check: series category must match podcast category
                    const seriesDetails = await db.prepare('SELECT category_id FROM series WHERE id = ?').bind(input.series_id).first<{category_id: number}>();
                    if (seriesDetails && seriesDetails.category_id !== input.category_id) {
                        return { success: false, message: 'Podcast category must match the series category.'};
                    }
                }
                
                // Determine if status is changing to update last_status_change_at
                const currentPodcast = await db.prepare('SELECT status FROM podcasts WHERE id = ?').bind(input.id).first<{status: string}>();
                let updateLastStatusChangeAt = false;
                if (currentPodcast && currentPodcast.status !== input.status) {
                    updateLastStatusChangeAt = true;
                }


                const result = await db.prepare(
                    `UPDATE podcasts SET 
                        title = ?, description = ?, markdown_content = ?, category_id = ?, series_id = ?,
                        source_audio_bucket_key = ?, source_background_bucket_key = ?, video_bucket_key = ?, thumbnail_bucket_key = ?,
                        tags = ?, first_comment = ?, type = ?, status = ?, scheduled_publish_at = ?, 
                        updated_at = CURRENT_TIMESTAMP
                        ${updateLastStatusChangeAt ? ', last_status_change_at = CURRENT_TIMESTAMP' : ''}
                    WHERE id = ?`
                )
                .bind(
                    input.title, input.description, input.markdown_content, input.category_id, input.series_id,
                    input.source_audio_bucket_key, input.source_background_bucket_key, input.video_bucket_key, input.thumbnail_bucket_key,
                    input.tags, input.first_comment, input.type, input.status, input.scheduled_publish_at,
                    input.id
                )
                .run();

                if (result.meta?.changes === 0) {
                    return { success: false, message: 'Podcast not found or no changes made.' };
                }

                console.log(`Podcast ${input.id} updated:`, result);
                return { success: true, message: 'Podcast updated successfully.' };
            } catch (error: any) {
                console.error(`Error updating podcast ${input.id}:`, error);
                 if (error.message?.includes('FOREIGN KEY constraint failed')) {
                    return { success: false, message: 'Invalid Category or Series ID provided, or category mismatch.' };
                }
                if (error.message?.includes('CHECK constraint failed: type') || error.message?.includes('CHECK constraint failed: status')) {
                    return { success: false, message: 'Invalid type or status value.' };
                }
                if (error.message?.includes('CHECK constraint failed: json_valid(tags)')) {
                    return { success: false, message: 'Tags must be a valid JSON string.' };
                }
                return { success: false, message: 'Failed to update podcast.' };
            }
        }
    }),

    // --- UPLOAD AUDIO --- //
    uploadPodcastAudio: defineAction({
        accept: 'form', 
        input: UploadPodcastAudioSchema,
        handler: async (
            uploadInput: z.infer<typeof UploadPodcastAudioSchema>,
            context: ActionAPIContext
        ) => {
            const { podcastId, audioFile } = uploadInput;
            const db = context.locals.runtime.env.DB;
            const VIDEO_SOURCE_BUCKET = context.locals.runtime.env.VIDEO_SOURCE_BUCKET as CloudflareR2Bucket | undefined;
            
            if (!VIDEO_SOURCE_BUCKET) {
                console.error("VIDEO_SOURCE_BUCKET binding not found in runtime environment.");
                return { success: false, message: 'Audio storage service is not configured.' };
            }

            let r2ObjectKey: string | undefined = undefined; 

            try {
                const podcastRecord = await db.prepare('SELECT id, source_audio_bucket_key FROM podcasts WHERE id = ?').bind(podcastId).first<{ id: number; source_audio_bucket_key: string | null; }>();
                if (!podcastRecord) {
                    return { success: false, message: 'Podcast not found.' };
                }

                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                r2ObjectKey = `podcasts/${podcastId}/audio/${uniqueSuffix}-${audioFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
                
                const r2Object = await VIDEO_SOURCE_BUCKET.put(r2ObjectKey, await audioFile.arrayBuffer(), {
                    httpMetadata: { contentType: audioFile.type },
                });

                if (!r2Object || !r2Object.key) {
                    console.error("Failed to upload audio to R2. R2 object key is missing.", r2Object);
                    return { success: false, message: 'Failed to upload audio file to storage.' };
                }
                
                // Delete old audio file from R2 if it exists and is different
                const oldAudioKey = podcastRecord.source_audio_bucket_key;
                if (oldAudioKey && oldAudioKey !== r2Object.key) {
                    try {
                       await VIDEO_SOURCE_BUCKET.delete(oldAudioKey);
                       console.log(`Old audio file ${oldAudioKey} deleted from R2 for podcast ${podcastId}`);
                    } catch (deleteError) {
                        console.error(`Failed to delete old audio file ${oldAudioKey} from R2:`, deleteError);
                    }
                }

                const updateResult = await db.prepare(
                    'UPDATE podcasts SET source_audio_bucket_key = ?, updated_at = CURRENT_TIMESTAMP, last_status_change_at = CURRENT_TIMESTAMP WHERE id = ?'
                )
                .bind(r2Object.key, podcastId)
                .run();

                if (updateResult.meta?.changes === 0) {
                    console.warn(`No changes made to podcast ${podcastId} audio key, though R2 upload was successful.`);
                }

                console.log(`Audio for podcast ${podcastId} uploaded to R2: ${r2Object.key}, DB updated.`);
                return { success: true, message: 'Audio file uploaded and podcast updated successfully.', newAudioKey: r2Object.key };

            } catch (error: any) {
                console.error(`Error uploading audio for podcast ${podcastId}:`, error);
                if (r2ObjectKey && VIDEO_SOURCE_BUCKET) { 
                    try {
                        await VIDEO_SOURCE_BUCKET.delete(r2ObjectKey);
                        console.log(`Cleaned up R2 object ${r2ObjectKey} due to error during audio upload process.`);
                    } catch (cleanupError) {
                        console.error(`Failed to cleanup R2 object ${r2ObjectKey}:`, cleanupError);
                    }
                }
                return { success: false, message: error.message || 'An unexpected error occurred during audio upload.' };
            }
        }
    }),

    // --- UPLOAD BACKGROUND MEDIA (IMAGE/VIDEO) --- //
    uploadBackgroundFile: defineAction({
        accept: 'form',
        input: UploadBackgroundMediaSchema,
        handler: async (
            uploadInput: z.infer<typeof UploadBackgroundMediaSchema>,
            context: ActionAPIContext
        ) => {
            const { podcastId, mediaFile } = uploadInput;
            const db = context.locals.runtime.env.DB;
            const VIDEO_SOURCE_BUCKET = context.locals.runtime.env.VIDEO_SOURCE_BUCKET as CloudflareR2Bucket | undefined;
            
            if (!VIDEO_SOURCE_BUCKET) {
                console.error("VIDEO_SOURCE_BUCKET binding not found in runtime environment.");
                return { success: false, message: 'Media storage service is not configured.' };
            }

            let r2ObjectKey: string | undefined = undefined; 

            try {
                const podcastRecord = await db.prepare('SELECT id, source_background_bucket_key FROM podcasts WHERE id = ?').bind(podcastId).first<{ id: number; source_background_bucket_key: string | null; }>();
                if (!podcastRecord) {
                    return { success: false, message: 'Podcast not found.' };
                }

                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                // Store background media in a 'background' subfolder to differentiate from source audio
                r2ObjectKey = `podcasts/${podcastId}/background/${uniqueSuffix}-${mediaFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
                
                const r2Object = await VIDEO_SOURCE_BUCKET.put(r2ObjectKey, await mediaFile.arrayBuffer(), {
                    httpMetadata: { contentType: mediaFile.type },
                });

                if (!r2Object || !r2Object.key) {
                    console.error("Failed to upload background media to R2. R2 object key is missing.", r2Object);
                    return { success: false, message: 'Failed to upload background media file to storage.' };
                }
                
                // Delete old background media file from R2 if it exists and is different
                const oldMediaKey = podcastRecord.source_background_bucket_key;
                if (oldMediaKey && oldMediaKey !== r2Object.key) {
                    try {
                       await VIDEO_SOURCE_BUCKET.delete(oldMediaKey);
                       console.log(`Old background media file ${oldMediaKey} deleted from R2 for podcast ${podcastId}`);
                    } catch (deleteError) {
                        console.error(`Failed to delete old background media file ${oldMediaKey} from R2:`, deleteError);
                        // Non-critical, so we don't fail the whole operation
                    }
                }

                const updateResult = await db.prepare(
                    'UPDATE podcasts SET source_background_bucket_key = ?, updated_at = CURRENT_TIMESTAMP, last_status_change_at = CURRENT_TIMESTAMP WHERE id = ?'
                )
                .bind(r2Object.key, podcastId)
                .run();

                if (updateResult.meta?.changes === 0) {
                    // This could happen if the key was somehow already the same, though unlikely with unique naming
                    console.warn(`No changes made to podcast ${podcastId} background media key, though R2 upload was successful.`);
                }

                console.log(`Background media for podcast ${podcastId} uploaded to R2: ${r2Object.key}, DB updated.`);
                return { success: true, message: 'Background media file uploaded and podcast updated successfully.', newMediaKey: r2Object.key };

            } catch (error: any) {
                console.error(`Error uploading background media for podcast ${podcastId}:`, error);
                // Attempt to clean up the uploaded file if an error occurred during DB update or other post-upload step
                if (r2ObjectKey && VIDEO_SOURCE_BUCKET) { 
                    try {
                        await VIDEO_SOURCE_BUCKET.delete(r2ObjectKey);
                        console.log(`Cleaned up R2 object ${r2ObjectKey} due to error during background media upload process.`);
                    } catch (cleanupError) {
                        console.error(`Failed to cleanup R2 object ${r2ObjectKey}:`, cleanupError);
                    }
                }
                return { success: false, message: error.message || 'An unexpected error occurred during background media upload.' };
            }
        }
    }),

    // --- DELETE --- //
    deletePodcast: defineAction({
        input: z.object({ id: z.number().int().positive() }),
        handler: async (
            deleteInput: { id: number },
            context: ActionAPIContext
        ) => {
            const { id } = deleteInput;
            const db = context.locals.runtime.env.DB;
            const VIDEO_SOURCE_BUCKET = context.locals.runtime.env.VIDEO_SOURCE_BUCKET as CloudflareR2Bucket | undefined;
            const VIDEO_OUTPUT_BUCKET = context.locals.runtime.env.VIDEO_OUTPUT_BUCKET as CloudflareR2Bucket | undefined;
            const WEBSITE_BUCKET = context.locals.runtime.env.WEBSITE_BUCKET as CloudflareR2Bucket | undefined;


            try {
                const podcastToDelete = await db.prepare(
                    'SELECT source_audio_bucket_key, video_bucket_key, thumbnail_bucket_key, source_background_bucket_key FROM podcasts WHERE id = ?'
                ).bind(id).first<{ source_audio_bucket_key: string | null; video_bucket_key: string | null; thumbnail_bucket_key: string | null; source_background_bucket_key: string | null; }>();

                if (!podcastToDelete) {
                     return { success: false, message: 'Podcast not found for deletion.' };
                }

                // Delete associated R2 files
                const keysToDelete: { bucket: CloudflareR2Bucket | undefined, key: string | null }[] = [
                    { bucket: VIDEO_SOURCE_BUCKET, key: podcastToDelete.source_audio_bucket_key },
                    { bucket: VIDEO_OUTPUT_BUCKET, key: podcastToDelete.video_bucket_key },
                    { bucket: WEBSITE_BUCKET, key: podcastToDelete.thumbnail_bucket_key },
                    { bucket: WEBSITE_BUCKET, key: podcastToDelete.source_background_bucket_key}
                ];

                for (const item of keysToDelete) {
                    if (item.key && item.bucket) {
                        try {
                            await item.bucket.delete(item.key);
                            console.log(`Deleted R2 object ${item.key} from bucket for podcast ${id}`);
                        } catch (r2Error) {
                            console.error(`Error deleting R2 object ${item.key} for podcast ${id}:`, r2Error);
                        }
                    }
                }
                
                const result = await db.prepare('DELETE FROM podcasts WHERE id = ?').bind(id).run();

                if (result.meta?.changes === 0) {
                    return { success: false, message: 'Podcast database record not found or already deleted.' };
                }

                console.log(`Podcast ${id} database record deleted`);
                return { success: true, message: 'Podcast and associated files deleted successfully.' };
            } catch (error) {
                console.error(`Error deleting podcast ${id} record:`, error);
                return { success: false, message: 'Failed to delete podcast record.' };
            }
        }
    }),

    // --- STREAM R2 OBJECT --- //
    streamR2Object: defineAction({
        input: StreamR2ObjectSchema,
        handler: async (
            input: z.infer<typeof StreamR2ObjectSchema>,
            context: ActionAPIContext
        ): Promise<Response> => {
            const { key, bucketType, filename } = input;
            const runtimeEnv = context.locals.runtime.env;
            let bucket: CloudflareR2Bucket | undefined;

            switch (bucketType) {
                case 'VIDEO_OUTPUT_BUCKET':
                    bucket = runtimeEnv.VIDEO_OUTPUT_BUCKET;
                    break;
                case 'VIDEO_SOURCE_BUCKET':
                    bucket = runtimeEnv.VIDEO_SOURCE_BUCKET;
                    break;
                case 'AUDIO_SOURCE_BUCKET':
                    // Assuming audio files are stored in VIDEO_SOURCE_BUCKET as per uploadPodcastAudio logic
                    // Or define a specific AUDIO_SOURCE_BUCKET if it exists
                    bucket = runtimeEnv.VIDEO_SOURCE_BUCKET; 
                    break;
                case 'BACKGROUND_SOURCE_BUCKET':
                    // Assuming background files are stored in VIDEO_SOURCE_BUCKET as per uploadBackgroundFile logic
                    bucket = runtimeEnv.VIDEO_SOURCE_BUCKET; 
                    break;
                case 'THUMBNAIL_OUTPUT_BUCKET':
                    // Assuming thumbnails are stored in VIDEO_OUTPUT_BUCKET or define a specific one
                    bucket = runtimeEnv.VIDEO_OUTPUT_BUCKET; 
                    break;
                default:
                    // This case should ideally be prevented by Zod schema validation
                    return new Response('Invalid bucket type specified.', { status: 400 });
            }

            if (!bucket) {
                console.error(`R2 bucket not configured for type: ${bucketType}`);
                return new Response('Bucket configuration error.', { status: 500 });
            }

            try {
                const object = await bucket.get(key);

                if (object === null) {
                    return new Response('File not found in R2 bucket.', { status: 404 });
                }

                const headers = new Headers();
                headers.set('Content-Disposition', `attachment; filename="${filename}"`);
                headers.set('Content-Type', (object.httpMetadata && object.httpMetadata.contentType) || 'application/octet-stream');
                headers.set('Content-Length', object.size.toString());

                // Return a new Response with the R2 object's readable stream
                // Cast to ReadableStream to ensure type compatibility with Response constructor
                return new Response(object.body as ReadableStream, {
                    headers: headers,
                    status: 200
                });

            } catch (error) {
                console.error(`Error streaming R2 object (key: ${key}, bucketType: ${bucketType}):`, error);
                return new Response('Failed to retrieve file from storage.', { status: 500 });
            }
        }
    })
};
