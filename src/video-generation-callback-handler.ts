import type { Env } from './env.d';

// Define the expected payload structure
interface VideoGenerationPayload {
	taskId: string;
	// podcastId: string; // podcastId is no longer directly in the payload
	status: 'completed' | 'failed' | string; // Allow other potential statuses
	video_url?: string; // Optional as it might not be present on failure
	error?: string; // Optional error message
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
	if (!payload.taskId || !payload.status) { // podcastId is no longer directly in the payload
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
		if (!payload.video_url) {
			console.error('Missing video_url for completed status, Task ID:', payload.taskId);
			return new Response('Missing video_url for completed status', { status: 400 });
		}

		try {
			const now = new Date().toISOString();
			const stmt = env.DB.prepare(
				'UPDATE podcasts SET video_bucket_key = ?, status = \'generated\', last_status_change_at = ?, updated_at = ? WHERE id = ?'
			);
			const result = await stmt.bind(payload.video_url, now, now, podcastId).run();

			if (result.success && result.meta.changes > 0) {
				console.log(`Successfully updated podcast ${podcastId} status to generated.`);
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
	} else {
		// Handle other statuses (e.g., 'failed') if necessary
		console.log(`Received non-completed status '${payload.status}' for Task ID: ${payload.taskId}. No database update performed for podcast ${podcastId}.`);
		// Optionally update the status to 'failed' or log the error
		// const now = new Date().toISOString();
		// await env.DB.prepare('UPDATE podcasts SET status = ?, last_status_change_at = ?, updated_at = ? WHERE id = ?')
		//    .bind(payload.status, now, now, podcastId)
		//    .run();
		return new Response(`Callback received for podcast ${podcastId} with status ${payload.status}`, { status: 200 });
	}
}
