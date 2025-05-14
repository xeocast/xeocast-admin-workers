import type { Env } from './env.d';

export async function handleScheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
	console.log(`trigger fired at ${event.cron}`);

	// Check if there's already a podcast being generated
	const generatingCheck = await env.DB.prepare(
		'SELECT id FROM podcasts WHERE status = ? LIMIT 1'
	).bind('generating').first();

	if (generatingCheck) {
		console.log('A podcast is already being generated. Skipping this run.');
		return;
	}

	// Find the next pending podcast, prioritizing scheduled ones
	const podcastToProcess = await env.DB.prepare(
		`SELECT id, source_audio_bucket_key, source_background_bucket_key
		 FROM podcasts
		 WHERE status = ?
		 ORDER BY
			 CASE WHEN scheduled_publish_at IS NOT NULL THEN 0 ELSE 1 END, -- Prioritize scheduled
			 scheduled_publish_at ASC, -- Newer scheduled first (among scheduled)
			 created_at ASC -- Oldest created first (among non-scheduled or if scheduled times are equal)
		 LIMIT 1`
	).bind('pending').first<{ id: number; source_audio_bucket_key: string; source_background_bucket_key: string }>();

	if (!podcastToProcess) {
		console.log('No pending podcasts found.');
		return;
	}

	console.log(`Found podcast to process: ID ${podcastToProcess.id}`);

	// Call the video generation service
	const videoServiceUrl = env.ENVIRONMENT === 'production'
		? 'https://video-service.xeocast.com/generate-video'
		: 'http://localhost:8001/generate-video';
	const callbackUrl = env.ENVIRONMENT === 'production'
		? 'https://dash-cron-worker.xeocast.workers.dev/video-generation-callback'
		: 'http://localhost:8787/video-generation-callback';

	console.log('Test:', 5);
		
	const videoServiceTasksResponse = await fetch('https://video-service.xeocast.com/tasks', {
		headers: {
			'X-API-Key': env.VIDEO_SERVICE_API_KEY,
		},
	});
	const videoServiceTasksJson = await videoServiceTasksResponse.json();	
	console.log('Current tasks on video service:', videoServiceTasksResponse.status, videoServiceTasksJson);


	try {
		const response = await fetch(videoServiceUrl, {
			method: 'POST',
			headers: {
				'X-API-Key': env.VIDEO_SERVICE_API_KEY,
				'Content-Type': 'application/json',
				'Accept': '*/*'
			},
			body: JSON.stringify({
				callbackUrl,
				sourceAudioBucketKey: podcastToProcess.source_audio_bucket_key,
				sourceBackgroundBucketKey: podcastToProcess.source_background_bucket_key,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Failed to call video service for podcast ${podcastToProcess.id}: ${response.status} ${response.statusText} - ${errorText}`);
			return; // Stop processing this podcast for now
		}

		// Process successful response from video service
		let responseData: { taskId?: string }; // Type assertion for responseData
		try {
			responseData = await response.json() as { taskId?: string }; // Type assertion after parsing
		} catch (parseError) {
			console.error(`Failed to parse JSON response from video service for podcast ${podcastToProcess.id}:`, parseError);
			return; // Stop processing this podcast if parsing fails
		}

		const externalTaskId = responseData.taskId;

		if (!externalTaskId) {
			console.error(`Video service response for podcast ${podcastToProcess.id} did not contain an 'taskId'. Response:`, JSON.stringify(responseData));
			return; // Stop processing if taskId is missing
		}

		// Record the successful call and external_task_id in external_service_tasks
		const newExternalTaskData = JSON.stringify({ podcast_id: podcastToProcess.id });
		try {
			const externalTaskInsertResult = await env.DB.prepare(
				'INSERT INTO external_service_tasks (external_task_id, type, data, status) VALUES (?, ?, ?, ?)'
			).bind(externalTaskId, 'video_generation_request', newExternalTaskData, 'initiated').run();

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
		console.error(`Error processing podcast ${podcastToProcess.id}:`, error);
		// Handle network errors or other exceptions during the fetch/update
	}
}
