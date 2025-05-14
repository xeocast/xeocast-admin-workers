/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your Worker in action
 * - Run `npm run deploy` to publish your Worker
 *
 * Bind resources to your Worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { handleScheduled } from './scheduled-handler';
import { handleVideoGenerationCallback } from './video-generation-callback-handler';
import type { Env } from './env.d';

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(req.url);

		if (req.method === 'POST' && url.pathname === '/video-generation-callback') {
			return handleVideoGenerationCallback(req, env);
		}

		// Default route for testing scheduled handler
		const testUrl = new URL(req.url);
		testUrl.pathname = '/__scheduled';
		testUrl.searchParams.append('cron', '* * * * *');
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${testUrl.href}". For the callback, use GET /video-generation-callback?videoId=...&status=...`, { status: 200 });
	},

	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// [[triggers]] configuration.
	scheduled: handleScheduled as ExportedHandlerScheduledHandler<Env>,
} satisfies ExportedHandler<Env>;
