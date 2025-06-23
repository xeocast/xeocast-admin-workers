import { z } from '@hono/zod-openapi';
import { EpisodeListItemSchema } from './episode.schemas';

// Schema for the 'waiting-and-generating' data point
export const WaitingAndGeneratingSchema = z
	.object({
		materialGenerated: z.number().int().openapi({
			description: 'Number of episodes with status "materialGenerated".',
			example: 5,
		}),
		generatingVideo: z.number().int().openapi({
			description: 'Number of episodes with status "generatingVideo".',
			example: 2,
		}),
	})
	.openapi('WaitingAndGenerating');

// Schema for the 'to-research' section, which includes episodes and series info
export const ToResearchItemSchema = z.object({
    series_id: z.number().int(),
    series_title: z.string(),
    show_id: z.number().int(),
    show_title: z.string(),
    episodes: z.array(EpisodeListItemSchema),
    total_draft_episodes: z.number().int(),
});

export const ToResearchSchema = z.array(ToResearchItemSchema);

// The main response schema for the /whats-next endpoint
export const WhatsNextResponseSchema = z
	.object({
		'to-generate-material': z.array(EpisodeListItemSchema).openapi({
			description: 'Episodes with status "researched", ready for material generation.',
		}),
		'waiting-and-generating': WaitingAndGeneratingSchema,
		'to-publish-on-youtube': z.array(EpisodeListItemSchema).openapi({
			description: 'Episodes with status "videoGenerated" and not yet published on YouTube.',
		}),
		'to-publish-on-x': z.array(EpisodeListItemSchema).openapi({
			description: 'Episodes with status "videoGenerated" and not yet published on X.',
		}),
		'to-research': ToResearchSchema.openapi({
            description: 'A sample of episodes with status "draft", grouped by series.'
        }),
	})
	.openapi('WhatsNextResponse');
