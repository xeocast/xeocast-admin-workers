import type { Env } from '../env.d';

// Define the expected payload structure
interface YouTubeUploadPayload {
	taskId: string; // This will be the external_task_id from external_service_tasks
	status: 'completed' | 'error';
	youtube_video_id?: string; // Present if status is 'completed', this is the YouTube Video ID.
	youtube_video_url?: string; // Present if status is 'completed'
	error?: string; // Present if status is 'error'
}

export async function handleYouTubeUploadCallback(request: Request, env: Env): Promise<Response> {
	console.log('Received YouTube upload callback request:', request.url);

	if (request.method !== 'POST') {
		console.warn('YouTube upload callback received non-POST request');
		return new Response('Expected POST request', { status: 405 });
	}

	let payload: YouTubeUploadPayload;
	try {
		payload = await request.json<YouTubeUploadPayload>();
	} catch (e) {
		console.error('Failed to parse JSON payload for YouTube upload callback:', e);
		return new Response('Invalid JSON payload', { status: 400 });
	}

	// Validate required fields
	if (!payload.taskId || !payload.status) {
		console.error('Missing required fields in YouTube upload callback payload (taskId, status):', payload);
		return new Response('Missing required fields in payload (taskId, status)', { status: 400 });
	}

	console.log(`YouTube upload callback received for Task ID: ${payload.taskId}, Status: ${payload.status}`);

	// Fetch podcast_id and youtube_channel_id from external_service_tasks table
	let podcastId: string;
	let youtubeChannelId: string;
	try {
		const taskStmt = env.DB.prepare('SELECT data FROM external_service_tasks WHERE external_task_id = ? AND type = \'youtube_upload_request\'');
		const taskResult = await taskStmt.bind(payload.taskId).first<{ data: string }>();

		if (!taskResult || !taskResult.data) {
			console.error(`Task not found or data field missing for external_task_id: ${payload.taskId} with type 'youtube_upload_request'`);
			return new Response(`Task details not found for taskId: ${payload.taskId}`, { status: 404 });
		}

		const taskData = JSON.parse(taskResult.data);
		if (!taskData.podcast_id) {
			console.error(`podcast_id missing in data for external_task_id: ${payload.taskId}`, taskData);
			return new Response(`podcast_id not found in task data for taskId: ${payload.taskId}`, { status: 400 });
		}
		if (!taskData.youtube_channel_id) {
			console.error(`youtube_channel_id missing in data for external_task_id: ${payload.taskId}`, taskData);
			return new Response(`youtube_channel_id not found in task data for taskId: ${payload.taskId}`, { status: 400 });
		}
		podcastId = taskData.podcast_id.toString();
		youtubeChannelId = taskData.youtube_channel_id.toString();
		console.log(`Retrieved Podcast ID: ${podcastId} and YouTube Channel ID: ${youtubeChannelId} for Task ID: ${payload.taskId}`);

	} catch (dbError) {
		console.error('Database error fetching task details for YouTube upload, external_task_id:', payload.taskId, dbError);
		return new Response('Internal server error fetching task details', { status: 500 });
	}

	const now = new Date().toISOString();

	if (payload.status === 'completed') {
		if (!payload.youtube_video_id) {
			console.error('Missing youtube_video_id for completed YouTube upload status, Task ID:', payload.taskId);
			// Even if youtube_video_id is missing, we might still want to mark the task as 'error'
			// and podcast as 'generatedApproved' to allow for manual intervention or re-trigger.
			// For now, strict check and return 400.
			return new Response('Missing youtube_video_id for completed status.', { status: 400 });
		}

		// Optionally log the youtube_video_url if present
		if (payload.youtube_video_url) {
			console.log(`YouTube video URL for Task ID ${payload.taskId}: ${payload.youtube_video_url}`);
		}

		try {
			const podcastUpdateStmt = env.DB.prepare(
				'UPDATE podcasts SET status = \'uploaded\', last_status_change_at = ?, updated_at = ? WHERE id = ?'
			);
			const youtubeVideoInsertStmt = env.DB.prepare(
				'INSERT INTO youtube_videos (podcast_id, youtube_channel_id, youtube_platform_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
			);
			const taskUpdateStmt = env.DB.prepare(
				'UPDATE external_service_tasks SET status = \'completed\', updated_at = ? WHERE external_task_id = ?'
			);

			const batchResults = await env.DB.batch([
				podcastUpdateStmt.bind(now, now, podcastId),
				youtubeVideoInsertStmt.bind(podcastId, youtubeChannelId, payload.youtube_video_id, now, now),
				taskUpdateStmt.bind(now, payload.taskId)
			]);

			// Check results of batch operations
			const podcastUpdateResult = batchResults[0];
			const youtubeVideoInsertResult = batchResults[1];
			const taskUpdateResult = batchResults[2];

			if (podcastUpdateResult.success && podcastUpdateResult.meta.changes > 0 && youtubeVideoInsertResult.success && youtubeVideoInsertResult.meta.changes > 0) {
				console.log(`Successfully updated podcast ${podcastId} status to uploaded and created youtube_videos record.`);

				if (taskUpdateResult.success && taskUpdateResult.meta.changes > 0) {
					console.log(`Successfully updated external_service_tasks for ${payload.taskId} to completed.`);
				} else {
					console.warn(`Failed to update or find external_service_tasks for ${payload.taskId} to completed. Result:`, taskUpdateResult);
					// Note: The primary operations succeeded, so we might still return 200.
					// Consider if this partial failure warrants a different response or rollback (more complex).
				}
				return new Response(`Callback processed successfully for podcast ${podcastId}, status updated to uploaded, YouTube video recorded.`, { status: 200 });
			} else {
				let errorMsg = `Failed to process YouTube upload completion for podcast ${podcastId}.`;
				if (!podcastUpdateResult.success || podcastUpdateResult.meta.changes === 0) {
					errorMsg += ` Podcast update failed or podcast not found (Result: ${JSON.stringify(podcastUpdateResult)}).`;
					console.error(`Failed to update podcast ${podcastId} to uploaded or podcast not found. Result:`, podcastUpdateResult);
				}
				if (!youtubeVideoInsertResult.success || youtubeVideoInsertResult.meta.changes === 0) {
					errorMsg += ` YouTube video record insert failed (Result: ${JSON.stringify(youtubeVideoInsertResult)}).`;
					console.error(`Failed to insert into youtube_videos for podcast ${podcastId}. Result:`, youtubeVideoInsertResult);
				}
				// Rollback or compensation logic would be complex here.
				// If one part of the batch fails, D1 typically rolls back the transaction if it's a true transaction.
				// However, env.DB.batch() might not guarantee transactional atomicity across all operations in all scenarios.
				// For now, returning a general error.
				return new Response(errorMsg, { status: 500 });
			}
		} catch (dbError) {
			console.error(`Database error during YouTube upload completion update for podcast: ${podcastId}`, dbError);
			return new Response('Internal server error during database update for upload completion.', { status: 500 });
		}
	} else if (payload.status === 'error') {
		console.error(`YouTube upload failed for Task ID: ${payload.taskId}, Podcast ID: ${podcastId}. Error: ${payload.error || 'No error details provided'}`);
		try {
			// Revert podcast status to 'generatedApproved' so it can be picked up again or investigated
			const podcastUpdateStmt = env.DB.prepare(
				'UPDATE podcasts SET status = \'generatedApproved\', last_status_change_at = ?, updated_at = ? WHERE id = ?'
			);
			const podcastUpdateResult = await podcastUpdateStmt.bind(now, now, podcastId).run();

			if (podcastUpdateResult.success && podcastUpdateResult.meta.changes > 0) {
				console.log(`Successfully updated podcast ${podcastId} status to generatedApproved due to upload error.`);
			} else {
				console.warn(`Failed to update podcast ${podcastId} status to generatedApproved or podcast not found. Result:`, podcastUpdateResult);
			}

			// Update external_service_tasks status to 'error'
			const taskUpdateStmt = env.DB.prepare(
				'UPDATE external_service_tasks SET status = \'error\', updated_at = ? WHERE external_task_id = ?'
			);
			const taskUpdateResult = await taskUpdateStmt.bind(now, payload.taskId).run();

			if (taskUpdateResult.success && taskUpdateResult.meta.changes > 0) {
				console.log(`Successfully updated external_service_tasks for ${payload.taskId} to error.`);
			} else {
				console.warn(`Failed to update or find external_service_tasks for ${payload.taskId} to error. Result:`, taskUpdateResult);
			}

			return new Response(`Callback processed for podcast ${podcastId}, YouTube upload failed. Status set to generatedApproved. Error: ${payload.error || 'No error details provided'}`, { status: 200 });
		} catch (dbError) {
			console.error(`Database error during YouTube upload error handling for podcast: ${podcastId}`, dbError);
			return new Response('Internal server error during database update for upload error.', { status: 500 });
		}
	} else {
		console.warn(`Received unexpected status '${payload.status}' for YouTube upload. Task ID: ${payload.taskId}, Podcast ID: ${podcastId}.`);
		return new Response(`Callback received with unexpected status: ${payload.status}`, { status: 400 });
	}
}
