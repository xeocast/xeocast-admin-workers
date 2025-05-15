import type { D1Database } from '@cloudflare/workers-types';
import type { Env } from '../env.d';

// --- Interfaces ---
interface PodcastForUpload {
    id: number;
    title: string;
    description: string | null;
    video_bucket_key: string;
    thumbnail_bucket_key: string | null;
    category_id: number;
    series_id: number | null;
    tags: string | null; // JSON string array
    first_comment: string | null;
    language_code: string; // From category, then from youtube_channel
    youtube_channel_platform_id: string;
    video_description_template: string;
    first_comment_template: string;
    scheduled_publish_at: string | null; 
}

interface YouTubeChannelInfo {
    id: number;
    youtube_platform_id: string;
    youtube_platform_category_id: string;
    title: string;
    description: string;
    video_description_template: string;
    first_comment_template: string;
    language_code: string;
}

interface SeriesInfo {
    id: number;
    title: string;
    description: string | null;
    category_id: number;
}

interface YouTubePlaylist {
    id: number; // Internal DB ID
    youtube_platform_id: string; // YouTube's own ID for the playlist
    title: string;
    description: string | null;
    channel_id: number; // Internal DB ID of the youtube_channel
    series_id: number; // Internal DB ID of the series
}

const VIDEO_SERVICE_BASE_URL = (env: Env) => 
    env.ENVIRONMENT === 'production' ? 'https://video-service.xeocast.com' : 'http://localhost:8001';

/**
 * Fetches YouTube channel information from the database.
 */
async function getYouTubeChannelInfo(db: D1Database, categoryId: number): Promise<YouTubeChannelInfo | null> {
    const channelInfo = await db.prepare(
        `SELECT
            yc.id,
            yc.youtube_platform_id,
            yc.youtube_platform_category_id,
            yc.title,
            yc.description,
            yc.video_description_template,
            yc.first_comment_template,
            yc.language_code
         FROM youtube_channels yc
         WHERE yc.category_id = ?`
    ).bind(categoryId).first<YouTubeChannelInfo>();

    if (!channelInfo) {
        console.error(`No YouTube channel found for category_id: ${categoryId}`);
        return null;
    }
    return channelInfo;
}

/**
 * Ensures a YouTube playlist exists if a podcast series requires one.
 * - Checks local DB for playlist_id.
 * - Verifies playlist existence on YouTube platform via external service.
 * - Creates playlist via external service if it doesn't exist on YouTube.
 * - Updates/creates local DB record for the playlist.
 * @returns The YouTube platform playlist ID if applicable, otherwise null.
 */
async function ensureYouTubePlaylist(
    db: D1Database, 
    env: Env, 
    seriesId: number, // This is series.id from the podcasts table
    seriesTitle: string, 
    seriesDescription: string | null, 
    youtubeChannelPlatformId: string // YouTube Channel's Platform ID to associate the playlist
): Promise<string | null> {
    console.log(`Ensuring playlist for series_id: ${seriesId}`);
    // Fetch series data (title and description are passed as params, but category_id might be useful if needed later)
    const seriesData = await db.prepare(
        'SELECT id, category_id FROM series WHERE id = ?'
    ).bind(seriesId).first<SeriesInfo>();

    if (!seriesData) {
        console.error(`Series with id ${seriesId} not found.`);
        return null;
    }

    let playlistPlatformId: string | null = null;
    const videoServiceUrl = VIDEO_SERVICE_BASE_URL(env);

    // Try to find an existing playlist for this series in our DB
    const existingPlaylistResult = await db.prepare(
        'SELECT id, youtube_platform_id, title, description, channel_id, series_id FROM youtube_playlists WHERE series_id = ?'
    ).bind(seriesId).first<YouTubePlaylist | undefined>();

    if (existingPlaylistResult && existingPlaylistResult.youtube_platform_id) {
        const existingPlaylist = existingPlaylistResult;
        console.log(`Found existing playlist in DB: ${existingPlaylist.youtube_platform_id} for series_id: ${seriesId}`);
        // Verify with YouTube
        try {
            const playlistCheckResponse = await fetch(`${videoServiceUrl}/youtube/playlists/${existingPlaylist.youtube_platform_id}`, {
                method: 'GET',
                headers: { 'X-API-Key': env.VIDEO_SERVICE_API_KEY },
            });
            if (playlistCheckResponse.ok) {
                const playlistDetails = await playlistCheckResponse.json() as { id: string, title: string, description: string };
                console.log(`Playlist ${existingPlaylist.youtube_platform_id} confirmed on YouTube titled: ${playlistDetails.title}`);
                playlistPlatformId = existingPlaylist.youtube_platform_id;
            } else if (playlistCheckResponse.status === 404) {
                console.log(`Playlist ${existingPlaylist.youtube_platform_id} (DB ID: ${existingPlaylist.id}) not found on YouTube. Will attempt to recreate.`);
                // Playlist not found on YouTube, proceed to create it below. 
                // The existing local DB record for this playlist might need to be updated or handled.
            } else {
                console.error(`Error checking playlist ${existingPlaylist.youtube_platform_id} on YouTube: ${playlistCheckResponse.status} ${await playlistCheckResponse.text()}`);
                return null; // Stop if there's an API error other than 404
            }
        } catch (error) {
            console.error(`Network error while checking playlist ${existingPlaylist.youtube_platform_id} on YouTube:`, error);
            return null;
        }
    }

    // If playlistPlatformId is still null, it means it wasn't found in DB, or wasn't confirmed/found on YouTube, so create/recreate it.
    if (!playlistPlatformId) {
        console.log(`No confirmed YouTube playlist for series_id: ${seriesId}. Attempting to create one.`);
        try {
            const createPlaylistResponse = await fetch(`${videoServiceUrl}/youtube/playlists/`, {
                method: 'POST',
                headers: {
                    'X-API-Key': env.VIDEO_SERVICE_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    youtube_channel_id: youtubeChannelPlatformId, // This is the YouTube Channel's own ID
                    title: seriesTitle, // Use series title for playlist title
                    description: seriesDescription || '',
                    privacy_status: 'public', // Or make this configurable if needed
                 }),
            });

            if (createPlaylistResponse.ok) {
                const newPlaylistData = await createPlaylistResponse.json() as { id: string; title: string; description: string | null }; // This 'id' is the youtube_platform_id
                playlistPlatformId = newPlaylistData.id;
                console.log(`Successfully created playlist on YouTube: ${playlistPlatformId} titled: ${newPlaylistData.title}`);
                
                // Save or update the youtube_playlists table in our DB
                const channelDbInfo = await db.prepare('SELECT id FROM youtube_channels WHERE youtube_platform_id = ?').bind(youtubeChannelPlatformId).first<{id: number}>();
                if (!channelDbInfo) {
                    console.error(`Cannot find internal youtube_channels record for youtube_platform_id: ${youtubeChannelPlatformId}. Cannot save playlist.`);
                    return null;
                }

                let localPlaylistRecord = await db.prepare('SELECT id FROM youtube_playlists WHERE youtube_platform_id = ?').bind(playlistPlatformId).first<{id: number}>();
                let playlistDbId: number;

                if (localPlaylistRecord) {
                    // Playlist with this platform_id exists, update it
                    playlistDbId = localPlaylistRecord.id;
                    await db.prepare(
                        'UPDATE youtube_playlists SET title = ?, description = ?, channel_id = ?, series_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
                    ).bind(newPlaylistData.title, newPlaylistData.description, channelDbInfo.id, seriesId, playlistDbId).run();
                    console.log(`Updated local youtube_playlists record ID: ${playlistDbId}`);
                } else {
                    // Playlist with this platform_id does not exist, insert new record
                    const insertResult = await db.prepare(
                        'INSERT INTO youtube_playlists (youtube_platform_id, title, description, channel_id, series_id) VALUES (?, ?, ?, ?, ?)'
                    ).bind(playlistPlatformId, newPlaylistData.title, newPlaylistData.description, channelDbInfo.id, seriesId).run();
                    playlistDbId = insertResult.meta.last_row_id as number;
                    console.log(`Inserted new local youtube_playlists record ID: ${playlistDbId}`);
                }
                
                // The link between series and playlist is maintained by youtube_playlists.series_id,
                // which is set during INSERT or UPDATE of the youtube_playlists table.
                // No separate update to the 'series' table is needed for this.
                console.log(`Upserted local youtube_playlists record ID: ${playlistDbId} for series_id: ${seriesId}`);

            } else {
                console.error(`Failed to create playlist on YouTube: ${createPlaylistResponse.status} ${await createPlaylistResponse.text()}`);
                return null;
            }
        } catch (error) {
            console.error(`Network error while creating playlist on YouTube:`, error);
            return null;
        }
    }

    return playlistPlatformId;
}

export async function triggerYouTubeUpload(env: Env): Promise<void> {
    console.log('Attempting to trigger YouTube video upload...');
    const db = env.DB;
    const videoServiceUrl = VIDEO_SERVICE_BASE_URL(env);

    // Check if there's already a podcast being uploaded
    const uploadingCheck = await db.prepare(
        'SELECT id FROM podcasts WHERE status = ? LIMIT 1'
    ).bind('uploading').first();

    if (uploadingCheck) {
        console.log('A podcast is already being uploaded to YouTube. Skipping this run.');
        return;
    }

    // Find the next 'generatedApproved' podcast, prioritizing scheduled_publish_at
    const podcastToProcess = await db.prepare(
        `SELECT
            p.id, p.title, p.description, p.video_bucket_key, p.thumbnail_bucket_key, p.category_id, p.series_id,
            p.tags, p.first_comment, p.scheduled_publish_at,
            yc.youtube_platform_id as youtube_channel_platform_id,
            yc.video_description_template,
            yc.first_comment_template,
            yc.language_code
         FROM podcasts p
         JOIN youtube_channels yc ON p.category_id = yc.category_id
         WHERE p.status = ?
         ORDER BY
             CASE WHEN p.scheduled_publish_at IS NOT NULL THEN 0 ELSE 1 END,
             p.scheduled_publish_at ASC,
             p.created_at ASC
         LIMIT 1`
    ).bind('generatedApproved').first<PodcastForUpload>();

    if (!podcastToProcess) {
        console.log('No podcasts with status "generatedApproved" found for YouTube upload.');
        return;
    }

    console.log(`Found podcast to process for YouTube upload: ID ${podcastToProcess.id} - ${podcastToProcess.title}`);

    if (!podcastToProcess.video_bucket_key) {
        console.error(`Podcast ID ${podcastToProcess.id} is missing video_bucket_key. Cannot upload.`);
        // Optionally, update status to an error state or handle differently
        return;
    }
    
    const channelInfo = await getYouTubeChannelInfo(db, podcastToProcess.category_id);
    if (!channelInfo) {
        console.error(`Could not retrieve YouTube channel info for podcast ID ${podcastToProcess.id}. Aborting upload.`);
        return;
    }

    let youTubePlaylistPlatformId: string | null = null;
    if (podcastToProcess.series_id) {
        const seriesDetails = await db.prepare('SELECT title, description FROM series WHERE id = ?')
            .bind(podcastToProcess.series_id)
            .first<{title: string, description: string | null}>();
        
        if (seriesDetails) {
            youTubePlaylistPlatformId = await ensureYouTubePlaylist(
                db, 
                env, 
                podcastToProcess.series_id, 
                seriesDetails.title, 
                seriesDetails.description, 
                channelInfo.youtube_platform_id
            );
            if (!youTubePlaylistPlatformId) {
                console.warn(`Proceeding with upload for podcast ID ${podcastToProcess.id} without adding to a series playlist due to earlier errors.`);
            }
        } else {
            console.warn(`Series ID ${podcastToProcess.series_id} linked to podcast ${podcastToProcess.id} not found. Cannot process playlist.`);
        }
    }

    const callbackUrl = env.YOUTUBE_UPLOAD_CALLBACK_URL || 
        (env.ENVIRONMENT === 'production'
        ? 'https://dash-cron-worker.xeocast.workers.dev/youtube-upload-callback' // TODO: Define YOUTUBE_UPLOAD_CALLBACK_URL in env
        : 'http://localhost:8787/youtube-upload-callback');

    // Prepare video metadata
    const videoTitle = podcastToProcess.title;
    // Use podcast description, fallback to channel's template if podcast's is null/empty
    let videoDescription = podcastToProcess.description || ''; 
    if (channelInfo.video_description_template) {
        videoDescription = channelInfo.video_description_template.replace('{{VIDEO_DESCRIPTION}}', videoDescription);
    }

    let tagsArray: string[] = [];
    if (podcastToProcess.tags) {
        try {
            tagsArray = JSON.parse(podcastToProcess.tags);
        } catch (e) {
            console.warn(`Could not parse tags for podcast ${podcastToProcess.id}: ${podcastToProcess.tags}`);
        }
    }

    // Prepare first comment
    let firstCommentText: string | null = podcastToProcess.first_comment || null;
    if (firstCommentText && channelInfo.first_comment_template) {
        firstCommentText = channelInfo.first_comment_template.replace('{{FIRST_COMMENT}}', firstCommentText);
    }

    const uploadPayload = {
        callback_url: callbackUrl,
        title: videoTitle,
        description: videoDescription,
        tags: tagsArray, // Expects an array of strings
        playlist_id: youTubePlaylistPlatformId, // YouTube Playlist ID (platform ID), can be null
        youtube_channel_id: channelInfo.youtube_platform_id, // YouTube Channel ID (platform ID)
        category_id: channelInfo.youtube_platform_category_id, // YouTube's category ID from channel settings
        video_file_key: podcastToProcess.video_bucket_key,
        video_thumbnail_key: podcastToProcess.thumbnail_bucket_key || '', // Can be null
        privacy_status: podcastToProcess.scheduled_publish_at ? 'private' : 'public', // 'private' if scheduled, else 'public'
        publish_at: podcastToProcess.scheduled_publish_at || undefined, // ISO 8601 format, optional
        first_comment: firstCommentText // Optional
    };

    console.log(`Attempting to upload video for podcast ${podcastToProcess.id} to YouTube channel ${channelInfo.youtube_platform_id}. Payload:`, JSON.stringify(uploadPayload, null, 2));

    try {
        const response = await fetch(`${videoServiceUrl}/youtube/videos/upload`, {
            method: 'POST',
            headers: {
                'X-API-Key': env.VIDEO_SERVICE_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadPayload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to call YouTube upload service for podcast ${podcastToProcess.id}: ${response.status} ${response.statusText} - ${errorText}`);
            // Consider setting podcast status to an error state
            return;
        }

        const responseData = await response.json() as { task_id?: string };
        const externalTaskId = responseData.task_id;

        if (!externalTaskId) {
            console.error(`YouTube upload service response for podcast ${podcastToProcess.id} did not contain a 'task_id'. Response:`, JSON.stringify(responseData));
            return;
        }

        // Record the successful call and external_task_id
        const externalTaskInsertData = JSON.stringify({ 
            podcast_id: podcastToProcess.id,
        });
        await db.prepare(
            'INSERT INTO external_service_tasks (external_task_id, type, data, status) VALUES (?, ?, ?, ?)'
        ).bind(externalTaskId, 'youtube_upload_request', externalTaskInsertData, 'processing').run();
        console.log(`Recorded external_service_task for YouTube upload of podcast ${podcastToProcess.id}, external_task_id: ${externalTaskId}`);

        // Update podcast status to 'uploading'
        await db.prepare(
            'UPDATE podcasts SET status = ?, last_status_change_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind('uploading', podcastToProcess.id).run();
        console.log(`Successfully updated podcast ${podcastToProcess.id} status to 'uploading'.`);

    } catch (error) {
        console.error(`Error processing YouTube upload for podcast ID ${podcastToProcess.id}:`, error);
    }
}
