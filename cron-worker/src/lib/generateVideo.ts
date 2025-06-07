import type { Env } from '../env.d';

export async function triggerVideoGeneration(env: Env): Promise<void> {
    console.log('Attempting to trigger video generation...');

    // Check if there's already a episode being generated
    const generatingCheck = await env.DB.prepare(
        'SELECT id FROM episodes WHERE status = ? LIMIT 1'
    ).bind('generatingVideo').first();

    if (generatingCheck) {
        console.log('A episode is already being generated. Skipping this run.');
        return;
    }

    // Find the next episode with status 'materialGenerated' and a valid audio key, prioritizing scheduled ones
    const episodeToProcess = await env.DB.prepare(
        `SELECT
            e.id,
            e.slug,
            e.title,
            e.show_id,
            e.series_id,
            e.type,
            e.audio_bucket_key,
            e.background_bucket_key,
            c.default_episode_background_bucket_key
         FROM episodes e
         JOIN shows c ON e.show_id = c.id
         WHERE e.status = ? AND e.freezeStatus = FALSE
         ORDER BY
             CASE WHEN e.scheduled_publish_at IS NOT NULL THEN 0 ELSE 1 END,
             e.scheduled_publish_at ASC,
             e.updated_at ASC
         LIMIT 1`
    ).bind('materialGenerated').first<{
        id: number;
        slug: string;
        title: string;
        show_id: number;
        series_id: number | null;
        type: string;
        audio_bucket_key: string; // Ensured by the query
        background_bucket_key: string | null;
        default_episode_background_bucket_key: string;
    }>();

    if (!episodeToProcess) {
        console.log('No episodes with status "materialGenerated" and freezeStatus FALSE found for video generation.');
        return;
    }

    console.log(`Found episode to process for video generation: ID ${episodeToProcess.id}`);

    let backgroundImageKey = episodeToProcess.background_bucket_key;
    if (!backgroundImageKey) { // Checks for null, undefined, or empty string
        console.log(`Episode ID ${episodeToProcess.id} is missing background_bucket_key. Using show default: ${episodeToProcess.default_episode_background_bucket_key}`);
        backgroundImageKey = episodeToProcess.default_episode_background_bucket_key;
    }

    const outputBucketKey = `${episodeToProcess.id}-${episodeToProcess.slug}/final/video.mp4`;

    const videoServiceUrl = env.ENVIRONMENT === 'production'
        ? 'https://video-srv.xeocast.com'
        : 'http://localhost:8001';

    // Check if video service is healthy
    const healthResponse = await fetch(`${videoServiceUrl}/health`, { method: 'GET' });
    if (healthResponse.status !== 200) {
        console.log(`Video service is not healthy. Response status: ${healthResponse.status}`);
        return;
    }

    const callbackUrl = env.ENVIRONMENT === 'production'
        ? 'https://dash-cron-worker.xeocast.workers.dev/video-generation-callback'
        : 'http://localhost:8787/video-generation-callback';

    try {
        const response = await fetch(`${videoServiceUrl}/generate-video`, {
            method: 'POST',
            headers: {
                'X-API-Key': env.VIDEO_SERVICE_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                callback_url: callbackUrl,
                audio_file_key: episodeToProcess.audio_bucket_key,
                background_image_key: backgroundImageKey, // Use the determined key
                output_bucket_key: outputBucketKey,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to call video service for episode ${episodeToProcess.id}: ${response.status} ${response.statusText} - ${errorText}`);
            return; // Stop processing this episode for now
        }

        // Process successful response from video service
        let responseData: { task_id?: string }; // Type assertion for responseData
        try {
            responseData = await response.json() as { task_id?: string }; // Type assertion after parsing
        } catch (parseError) {
            console.error(`Failed to parse JSON response from video service for episode ${episodeToProcess.id}:`, parseError);
            return; // Stop processing this episode if parsing fails
        }

        const externalTaskId = responseData.task_id;

        if (!externalTaskId) {
            console.error(`Video service response for episode ${episodeToProcess.id} did not contain an 'task_id'. Response:`, JSON.stringify(responseData));
            return; // Stop processing if task_id is missing
        }

        // Record the successful call and external_task_id in external_service_tasks
        const newExternalTaskData = JSON.stringify({
            episode_id: episodeToProcess.id,
            episode_title: episodeToProcess.title,
            episode_show_id: episodeToProcess.show_id,
            episode_series_id: episodeToProcess.series_id,
            episode_type: episodeToProcess.type
        });
        try {
            const externalTaskInsertResult = await env.DB.prepare(
                'INSERT INTO external_service_tasks (external_task_id, type, data, status) VALUES (?, ?, ?, ?)'
            ).bind(externalTaskId, 'video_generation_request', newExternalTaskData, 'processing').run();

            if (externalTaskInsertResult.success) {
                console.log(`Successfully created external_service_task for episode ${episodeToProcess.id} with external_task_id ${externalTaskId}.`);
            } else {
                console.error(`Failed to create external_service_task for episode ${episodeToProcess.id} with external_task_id ${externalTaskId}. DB Error: ${externalTaskInsertResult.error}`);
            }
        } catch (dbError) {
            console.error(`Database error when creating external_service_task for episode ${episodeToProcess.id} with external_task_id ${externalTaskId}:`, dbError);
        }

        // Update episode status to generatingVideo
        const updateResult = await env.DB.prepare(
            'UPDATE episodes SET status = ?, last_status_change_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind('generatingVideo', episodeToProcess.id).run();

        if (updateResult.success) {
            console.log(`Successfully updated episode ${episodeToProcess.id} status to generatingVideo.`);
        } else {
            console.error(`Failed to update episode ${episodeToProcess.id} status.`);
            // Handle potential database update failure
        }

    } catch (error) {
        console.error(`Error processing episode for video generation (ID ${episodeToProcess.id}):`, error);
        // Handle network errors or other exceptions during the fetch/update
    }
}
