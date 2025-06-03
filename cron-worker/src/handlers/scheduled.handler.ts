import type { Env } from '../env.d';
import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
import { triggerVideoGeneration } from '../lib/generateVideo';
// import { triggerYouTubeUpload } from '../lib/uploadToYouTube';

export async function handleScheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const now = new Date();
    const currentMinute = now.getMinutes();

    console.log(`trigger fired at ${event.cron} - current time: ${now.toISOString()}, minute: ${currentMinute}`);

    // if (currentMinute % 2 === 0) {
    //     console.log('Current minute is even, dispatching to video generation module.');
    await triggerVideoGeneration(env);
    // } else {
    //     console.log('Current minute is odd, dispatching to YouTube upload module.');
    //     await triggerYouTubeUpload(env);
    // }
}
