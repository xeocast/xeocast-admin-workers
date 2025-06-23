import { Context } from 'hono';
import type { CloudflareEnv } from '../../env';
import { z } from '@hono/zod-openapi';
import {
	WhatsNextResponseSchema,
} from '../../schemas/whats-next.schemas';
import { EpisodeSchema } from '../../schemas/episode.schemas';
import { GeneralServerErrorSchema } from '../../schemas/common.schemas';

const fetchEpisodesByStatus = async (db: D1Database, status: string, extraWhere: string = '') => {
    const query = `
        SELECT 
            e.*, 
            s.name as show_title, 
            se.title as series_title
        FROM episodes e
        LEFT JOIN shows s ON e.show_id = s.id
        LEFT JOIN series se ON e.series_id = se.id
        WHERE e.status = ?1 ${extraWhere}
        ORDER BY e.created_at DESC
    `;
    const { results } = await db.prepare(query).bind(status).all<any>();
        return z.array(EpisodeSchema).parse(results || []);
};

const fetchWaitingAndGeneratingCount = async (db: D1Database) => {
    const query = `
        SELECT 
            SUM(CASE WHEN status = 'materialGenerated' THEN 1 ELSE 0 END) as materialGenerated,
            SUM(CASE WHEN status = 'generatingVideo' THEN 1 ELSE 0 END) as generatingVideo
        FROM episodes
        WHERE status IN ('materialGenerated', 'generatingVideo')
    `;
    const result = await db.prepare(query).first<{ materialGenerated: number; generatingVideo: number; }>();
    return {
        materialGenerated: result?.materialGenerated || 0,
        generatingVideo: result?.generatingVideo || 0,
    };
};

const fetchToResearchEpisodes = async (db: D1Database) => {
    // Step 1: Find all series that have draft episodes
    const seriesWithDraftsQuery = `
        SELECT DISTINCT series_id 
        FROM episodes 
        WHERE status = 'draft'
    `;
    const { results: seriesResults } = await db.prepare(seriesWithDraftsQuery).all<{ series_id: number }>();
    if (!seriesResults) return [];

    const seriesIds = seriesResults.map(r => r.series_id);
    if (seriesIds.length === 0) return [];

    // Step 2: For each of those series, get up to 3 episodes, plus series/show info and total draft count
    // We use a CTE and window functions to rank episodes within each series.
    const episodesQuery = `
        WITH RankedEpisodes AS (
            SELECT 
                e.*,
                s.name as show_title,
                se.title as series_title,
                ROW_NUMBER() OVER(PARTITION BY e.series_id ORDER BY e.created_at DESC) as rn,
                COUNT(*) OVER(PARTITION BY e.series_id) as total_draft_episodes
            FROM episodes e
            LEFT JOIN shows s ON e.show_id = s.id
            LEFT JOIN series se ON e.series_id = se.id
            WHERE e.status = 'draft' AND e.series_id IN (${seriesIds.map(() => '?').join(',')})
        )
        SELECT * 
        FROM RankedEpisodes 
        WHERE rn <= 3
    `;

    const { results: episodeResults } = await db.prepare(episodesQuery).bind(...seriesIds).all<any>();
    if (!episodeResults) return [];

    // Step 3: Group the results by series
    const groupedBySeries = episodeResults.reduce((acc, row) => {
        if (!acc[row.series_id]) {
            acc[row.series_id] = {
                series_id: row.series_id,
                series_title: row.series_title,
                show_id: row.show_id,
                show_title: row.show_title,
                total_draft_episodes: row.total_draft_episodes,
                episodes: [],
            };
        }
                acc[row.series_id].episodes.push(EpisodeSchema.parse(row));
        return acc;
    }, {} as any);

    return Object.values(groupedBySeries);
};

export const listWhatsNextHandler = async (c: Context<{ Bindings: CloudflareEnv }>) => {
	try {
		const [toGenerateMaterial, waitingAndGenerating, toPublishOnYoutube, toPublishOnX, toResearch] = await Promise.all([
			fetchEpisodesByStatus(c.env.DB, 'researched'),
			fetchWaitingAndGeneratingCount(c.env.DB),
			fetchEpisodesByStatus(c.env.DB, 'videoGenerated', 'AND status_on_youtube = \'none\''),
			fetchEpisodesByStatus(c.env.DB, 'videoGenerated', 'AND status_on_x = \'none\''),
            fetchToResearchEpisodes(c.env.DB),
		]);

		const response = WhatsNextResponseSchema.parse({
			'to-generate-material': toGenerateMaterial,
			'waiting-and-generating': waitingAndGenerating,
			'to-publish-on-youtube': toPublishOnYoutube,
			'to-publish-on-x': toPublishOnX,
            'to-research': toResearch,
		});

		return c.json(response, 200);

	} catch (error) {
		console.error('Error fetching what\'s next data:', error);
		return c.json(GeneralServerErrorSchema.parse({ 
			message: 'Failed to fetch data for what\'s next due to a server error.' 
		}), 500);
	}
};