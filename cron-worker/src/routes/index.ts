import { handleVideoGenerationCallback } from '../handlers/videoGenerationCallback.handler';
import { handleYouTubeUploadCallback } from '../handlers/youtubeUploadCallback.handler';
import type { Env } from '../env.d';

export async function handleFetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === 'POST' && url.pathname === '/video-generation-callback') {
        return handleVideoGenerationCallback(req, env);
    }

    if (req.method === 'POST' && url.pathname === '/youtube-upload-callback') {
        return handleYouTubeUploadCallback(req, env);
    }

    // Default route for testing scheduled handler
    const testUrl = new URL(req.url);
    testUrl.pathname = '/__scheduled';
    testUrl.searchParams.append('cron', '* * * * *');
    return new Response(
        `...`,
        { status: 200 }
    );
}
