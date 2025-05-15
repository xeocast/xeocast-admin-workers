import type { Env } from '../env.d';
import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
import { triggerVideoGeneration } from '../lib/generateVideo';
import { triggerYouTubeUpload } from '../lib/uploadToYouTube';

export async function handleScheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    console.log(`trigger fired at ${event.cron} - current time: ${now.toISOString()}, minute: ${currentMinute}, second: ${currentSecond}`);

    if (currentMinute % 2 === 0) {
        console.log('Current minute is even, dispatching to video generation module.');
        await triggerVideoGeneration(env);
    } else if (currentSecond % 2 !== 0) {
        console.log('Current second is odd, dispatching to YouTube upload module.');
        await triggerYouTubeUpload(env);
    } else {
        console.log('Conditions not met for video generation or YouTube upload. Skipping this run.');
    }
}
