import { Context } from 'hono';
import { z } from 'zod';
import { zip } from 'fflate';
import type { CloudflareEnv } from '../../env';
import {
  EpisodeNotFoundErrorSchema
} from '../../schemas/episode.schemas';
import { PathIdParamSchema, GeneralServerErrorSchema } from '../../schemas/common.schemas';
import { getR2Bucket } from '../storage/utils';

const EpisodeDownloadInfoSchema = z.object({
	videoBucketKey: z.string(),
	episodeSlug: z.string(),
	seriesSlug: z.string(),
});

export const downloadYtPackageHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
	const paramParseResult = PathIdParamSchema.safeParse(c.req.param());

	if (!paramParseResult.success) {
		return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Invalid episode ID format.' }), 400);
	}

	const { id } = paramParseResult.data;

	try {
		const stmt = c.env.DB.prepare(`
      SELECT
        e.video_bucket_key AS videoBucketKey,
        e.slug AS episodeSlug,
        s.slug AS seriesSlug
      FROM episodes AS e
      JOIN series AS s ON e.series_id = s.id
      WHERE e.id = ?1
    `);
		const dbResult = await stmt.bind(id).first();

		if (!dbResult) {
			return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Episode not found.' }), 404);
		}

		const episodeInfo = EpisodeDownloadInfoSchema.parse(dbResult);

		const bucket = getR2Bucket(c, 'EPISODE_PROJECTS_BUCKET');
		if (!bucket) {
			return c.json(GeneralServerErrorSchema.parse({ message: 'Episode projects bucket not configured.' }), 500);
		}

		const videoObject = await bucket.get(episodeInfo.videoBucketKey);

		if (!videoObject) {
			return c.json(EpisodeNotFoundErrorSchema.parse({ message: 'Episode video file not found.' }), 404);
		}

		const videoData = await videoObject.arrayBuffer();

		const zipData = await new Promise<Uint8Array>((resolve, reject) => {
			zip(
				{
					[`${episodeInfo.seriesSlug}-${episodeInfo.episodeSlug}.mp4`]: new Uint8Array(videoData),
				},
				(err: Error | null, data: Uint8Array) => {
					if (err) {
						reject(err);
					} else {
						resolve(data);
					}
				}
			);
		});

		const zipFileName = `${episodeInfo.seriesSlug}-${episodeInfo.episodeSlug}-yt-pkg.zip`;

		return new Response(zipData, {
			headers: {
				'Content-Type': 'application/zip',
				'Content-Disposition': `attachment; filename="${zipFileName}"`,
			},
		});

	} catch (error) {
		console.error(`Failed to generate YT package for episode ${id}:`, error);
		return c.json(GeneralServerErrorSchema.parse({ message: 'Failed to generate YouTube package.' }), 500);
	}
};
