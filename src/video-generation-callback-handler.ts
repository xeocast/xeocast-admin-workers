import type { Env } from './env.d';

// Define the expected payload structure
interface VideoGenerationPayload {
	taskId: string;
	status: 'completed' | 'error'; // Status can be 'completed' or 'error'
	video_bucket_key?: string; // Present if status is 'completed', contains the S3 bucket key
	error?: string; // Present if status is 'error', contains error message
}

export async function handleVideoGenerationCallback(request: Request, env: Env): Promise<Response> {
	console.log('Received video generation callback request:', request.url);

	if (request.method !== 'POST') {
		return new Response('Expected POST request', { status: 405 });
	}

	let payload: VideoGenerationPayload;
	try {
		payload = await request.json<VideoGenerationPayload>();
	} catch (e) {
		console.error('Failed to parse JSON payload:', e);
		return new Response('Invalid JSON payload', { status: 400 });
	}

	// Validate required fields
	if (!payload.taskId || !payload.status) {
		return new Response('Missing required fields in payload (taskId, status)', { status: 400 });
	}

	console.log(`Callback received for Task ID: ${payload.taskId}, Status: ${payload.status}`);

	// Fetch podcast_id from external_service_tasks table
	let podcastId: string;
	try {
		const taskStmt = env.DB.prepare('SELECT data FROM external_service_tasks WHERE external_task_id = ?');
		const taskResult = await taskStmt.bind(payload.taskId).first<{ data: string }>();

		if (!taskResult || !taskResult.data) {
			console.error(`Task not found or data field missing for external_task_id: ${payload.taskId}`);
			return new Response(`Task details not found for taskId: ${payload.taskId}`, { status: 404 });
		}

		const taskData = JSON.parse(taskResult.data);
		if (!taskData.podcast_id) {
			console.error(`podcast_id missing in data for external_task_id: ${payload.taskId}`, taskData);
			return new Response(`podcast_id not found in task data for taskId: ${payload.taskId}`, { status: 400 });
		}
		podcastId = taskData.podcast_id.toString(); // Ensure it's a string if it's stored as a number
		console.log(`Retrieved Podcast ID: ${podcastId} for Task ID: ${payload.taskId}`);

	} catch (dbError) {
		console.error('Database error fetching task details for external_task_id:', payload.taskId, dbError);
		return new Response('Internal server error fetching task details', { status: 500 });
	}

	if (payload.status === 'completed') {
		if (!payload.video_bucket_key) {
			console.error('Missing video_bucket_key for completed status, Task ID:', payload.taskId);
			return new Response('Missing video_bucket_key for completed status. Payload expects "video_bucket_key".', { status: 400 });
		}

		try {
			const now = new Date().toISOString();
			const stmt = env.DB.prepare(
				'UPDATE podcasts SET video_bucket_key = ?, status = \'generated\', last_status_change_at = ?, updated_at = ? WHERE id = ?'
			);
			const result = await stmt.bind(payload.video_bucket_key, now, now, podcastId).run();

			if (result.success && result.meta.changes > 0) {
				console.log(`Successfully updated podcast ${podcastId} status to generated.`);

				// Update external_service_tasks status to 'completed'
				try {
					const taskUpdateStmt = env.DB.prepare(
						'UPDATE external_service_tasks SET status = \'completed\', updated_at = ? WHERE external_task_id = ?'
					);
					const taskUpdateResult = await taskUpdateStmt.bind(now, payload.taskId).run(); // 'now' is in scope

					if (taskUpdateResult.success && taskUpdateResult.meta.changes > 0) {
						console.log(`Successfully updated external_service_tasks for ${payload.taskId} to completed.`);
					} else if (taskUpdateResult.success && taskUpdateResult.meta.changes === 0) {
						console.warn(`external_service_tasks entry for ${payload.taskId} not found or no changes needed for completed status.`);
					} else {
						console.error(`Failed to update external_service_tasks for ${payload.taskId} to completed:`, taskUpdateResult.error);
					}
				} catch (estError) {
					 console.error(`Database error updating external_service_tasks for ${payload.taskId} to completed:`, estError);
				}

				return new Response(`Callback processed successfully for podcast ${podcastId}`, { status: 200 });
			} else if (result.success && result.meta.changes === 0) {
				console.warn(`Podcast with ID ${podcastId} not found or no changes needed.`);
				return new Response(`Podcast ${podcastId} not found or no update needed`, { status: 404 }); // Or 200 if no update needed is okay
			} else {
				console.error('Failed to update database for podcast:', podcastId, result.error);
				return new Response('Failed to update database status', { status: 500 });
			}
		} catch (dbError) {
			console.error('Database error during update for podcast:', podcastId, dbError);
			return new Response('Internal server error during database update', { status: 500 });
		}
	} else if (payload.status === 'error') {
		console.error(`Video generation failed for Task ID: ${payload.taskId}, Podcast ID: ${podcastId}. Error: ${payload.error || 'No error details provided'}`);
		// Optionally, update the podcast status to indicate failure
		try {
			const now = new Date().toISOString();
			// Set status to its previous value to retry the video generation
			const stmt = env.DB.prepare(
				// Consider adding a specific column for generation_error_message to store payload.error
				'UPDATE podcasts SET status = \'pending\', last_status_change_at = ?, updated_at = ? WHERE id = ?'
			);
			const result = await stmt.bind(now, now, podcastId).run();

			if (result.success && result.meta.changes > 0) {
				console.log(`Successfully updated podcast ${podcastId} status to pending.`);

				// Update external_service_tasks status to 'error'
				try {
					const taskUpdateStmt = env.DB.prepare(
						'UPDATE external_service_tasks SET status = \'error\', updated_at = ? WHERE external_task_id = ?'
					);
					const taskUpdateResult = await taskUpdateStmt.bind(now, payload.taskId).run(); // 'now' is in scope

					if (taskUpdateResult.success && taskUpdateResult.meta.changes > 0) {
						console.log(`Successfully updated external_service_tasks for ${payload.taskId} to error.`);
					} else if (taskUpdateResult.success && taskUpdateResult.meta.changes === 0) {
						console.warn(`external_service_tasks entry for ${payload.taskId} not found or no changes needed for error status.`);
					} else {
						console.error(`Failed to update external_service_tasks for ${payload.taskId} to error:`, taskUpdateResult.error);
					}
				} catch (estError) {
					console.error(`Database error updating external_service_tasks for ${payload.taskId} to error:`, estError);
				}

				// Even though it's an error from the video generation service,
				// the callback handler itself processed this error state successfully.
				return new Response(`Callback processed for podcast ${podcastId}, video generation failed.`, { status: 200 });
			} else if (result.success && result.meta.changes === 0) {
				console.warn(`Podcast with ID ${podcastId} not found when attempting to mark as pending.`);
				return new Response(`Podcast ${podcastId} not found for pending update.`, { status: 404 });
			} else {
				console.error('Failed to update database for podcast pending status:', podcastId, result.error);
				return new Response('Failed to update database for pending status.', { status: 500 });
			}
		} catch (dbError) {
			console.error('Database error during update for podcast pending status:', podcastId, dbError);
			return new Response('Internal server error during database update for pending status.', { status: 500 });
		}
	} else {
		// This case should ideally not be reached if the payload.status is strictly 'completed' or 'error'
		// as per the updated VideoGenerationPayload interface.
		console.warn(`Received unexpected status '${payload.status}' for Task ID: ${payload.taskId}, Podcast ID: ${podcastId}.`);
		return new Response(`Callback received with unexpected status: ${payload.status}`, { status: 400 });
	}
}
