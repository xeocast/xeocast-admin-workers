import { handleVideoGenerationCallback } from '../handlers/videoGenerationCallback.handler';
import type { Env } from '../env.d';

export async function handleFetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === 'POST' && url.pathname === '/video-generation-callback') {
        return handleVideoGenerationCallback(req, env);
    }

    // Default route for testing scheduled handler
    const testUrl = new URL(req.url);
    testUrl.pathname = '/__scheduled';
    testUrl.searchParams.append('cron', '* * * * *');
    return new Response(
        `To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${testUrl.href}". For the callback, use POST /video-generation-callback.`,
        { status: 200 }
    );
}
