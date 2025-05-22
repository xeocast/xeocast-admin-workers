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

import { handleScheduled } from './handlers/scheduled.handler'; // Updated path
import { handleFetch } from './routes/index'; // New import for router
import type { Env } from './env.d'; // Path remains the same

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return handleFetch(req, env, ctx); // Delegate to the router
	},

	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// [[triggers]] configuration.
	scheduled: handleScheduled as ExportedHandlerScheduledHandler<Env>,
} satisfies ExportedHandler<Env>;
