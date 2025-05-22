import type { Env } from '../env.d';

export async function triggerVideoGeneration(env: Env): Promise<void> {
    console.log('Attempting to trigger video generation...');

    // Check if there's already a podcast being generated
    const generatingCheck = await env.DB.prepare(
        'SELECT id FROM podcasts WHERE status = ? LIMIT 1'
    ).bind('generating').first();

    if (generatingCheck) {
        console.log('A podcast is already being generated. Skipping this run.');
        return;
    }

    // Find the next podcast with status 'audioGenerated' and a valid audio key, prioritizing scheduled ones
    const podcastToProcess = await env.DB.prepare(
        `SELECT
            p.id,
            p.source_audio_bucket_key,
            p.source_background_bucket_key,
            p.category_id,
            c.default_source_background_bucket_key
         FROM podcasts p
         JOIN categories c ON p.category_id = c.id
         WHERE p.status = ?
           AND p.source_audio_bucket_key IS NOT NULL
           AND p.source_audio_bucket_key <> ''
         ORDER BY
             CASE WHEN p.scheduled_publish_at IS NOT NULL THEN 0 ELSE 1 END,
             p.scheduled_publish_at ASC,
             p.created_at ASC
         LIMIT 1`
    ).bind('audioGenerated').first<{
        id: number;
        source_audio_bucket_key: string; // Ensured by the query
        source_background_bucket_key: string | null;
        category_id: number;
        default_source_background_bucket_key: string;
    }>();

    if (!podcastToProcess) {
        console.log('No podcasts with status "audioGenerated" and valid audio key found for video generation.');
        return;
    }

    console.log(`Found podcast to process for video generation: ID ${podcastToProcess.id}`);

    let backgroundImageKey = podcastToProcess.source_background_bucket_key;
    if (!backgroundImageKey) { // Checks for null, undefined, or empty string
        console.log(`Podcast ID ${podcastToProcess.id} is missing source_background_bucket_key. Using category default: ${podcastToProcess.default_source_background_bucket_key}`);
        backgroundImageKey = podcastToProcess.default_source_background_bucket_key;
    }

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
                audio_file_key: podcastToProcess.source_audio_bucket_key,
                background_image_key: backgroundImageKey, // Use the determined key
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to call video service for podcast ${podcastToProcess.id}: ${response.status} ${response.statusText} - ${errorText}`);
            return; // Stop processing this podcast for now
        }

        // Process successful response from video service
        let responseData: { task_id?: string }; // Type assertion for responseData
        try {
            responseData = await response.json() as { task_id?: string }; // Type assertion after parsing
        } catch (parseError) {
            console.error(`Failed to parse JSON response from video service for podcast ${podcastToProcess.id}:`, parseError);
            return; // Stop processing this podcast if parsing fails
        }

        const externalTaskId = responseData.task_id;

        if (!externalTaskId) {
            console.error(`Video service response for podcast ${podcastToProcess.id} did not contain an 'task_id'. Response:`, JSON.stringify(responseData));
            return; // Stop processing if task_id is missing
        }

        // Record the successful call and external_task_id in external_service_tasks
        const newExternalTaskData = JSON.stringify({ podcast_id: podcastToProcess.id });
        try {
            const externalTaskInsertResult = await env.DB.prepare(
                'INSERT INTO external_service_tasks (external_task_id, type, data, status) VALUES (?, ?, ?, ?)'
            ).bind(externalTaskId, 'video_generation_request', newExternalTaskData, 'processing').run();

            if (externalTaskInsertResult.success) {
                console.log(`Successfully created external_service_task for podcast ${podcastToProcess.id} with external_task_id ${externalTaskId}.`);
            } else {
                console.error(`Failed to create external_service_task for podcast ${podcastToProcess.id} with external_task_id ${externalTaskId}. DB Error: ${externalTaskInsertResult.error}`);
            }
        } catch (dbError) {
            console.error(`Database error when creating external_service_task for podcast ${podcastToProcess.id} with external_task_id ${externalTaskId}:`, dbError);
        }

        // Update podcast status to generating
        const updateResult = await env.DB.prepare(
            'UPDATE podcasts SET status = ?, last_status_change_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind('generating', podcastToProcess.id).run();

        if (updateResult.success) {
            console.log(`Successfully updated podcast ${podcastToProcess.id} status to generating.`);
        } else {
            console.error(`Failed to update podcast ${podcastToProcess.id} status.`);
            // Handle potential database update failure
        }

    } catch (error) {
        console.error(`Error processing podcast for video generation (ID ${podcastToProcess.id}):`, error);
        // Handle network errors or other exceptions during the fetch/update
    }
}
