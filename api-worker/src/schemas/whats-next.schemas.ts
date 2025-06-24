import { z } from '@hono/zod-openapi';

// Schema for a single episode, tailored for the 'What's Next' response
export const WhatsNextEpisodeSchema = z.object({
  id: z.number().openapi({ example: 123 }),
  title: z.string().openapi({ example: 'The Future of AI' }),
  slug: z.string().openapi({ example: 'the-future-of-ai' }),
  status: z.string().openapi({ example: 'draft' }),
  showId: z.number().openapi({ example: 1 }),
  seriesId: z.number().nullable().openapi({ example: 10 }),
  showName: z.string().nullable().openapi({ example: 'Tech Uncovered' }),
  seriesName: z.string().nullable().openapi({ example: 'AI Revolution' }),
  thumbnailGenPrompt: z.string().nullable().openapi({ example: 'A brain made of circuits' }),
  articleImageGenPrompt: z.string().nullable().openapi({ example: 'A robot writing an article' }),
  scheduledPublishAt: z.string().datetime().nullable().openapi({ example: '2025-07-01T12:00:00Z' }),
  freezeStatus: z.boolean().openapi({ example: true }),
  lastStatusChangeAt: z.string().datetime().openapi({ example: '2025-06-23T21:00:00Z' }),
  updatedAt: z.string().datetime().openapi({ example: '2025-06-23T21:00:00Z' }),
  createdAt: z.string().datetime().openapi({ example: '2025-06-20T10:00:00Z' }),
}).openapi('WhatsNextEpisode');

// Schema for a simple list of episodes
const EpisodeListSectionSchema = z.object({
	episodes: z.array(WhatsNextEpisodeSchema),
}).openapi('EpisodeListSection');

// Schema for the 'To Research' section, which groups episodes by series
export const ToResearchSeriesSchema = z.object({
  seriesId: z.number(),
  seriesName: z.string().nullable(),
  showId: z.number(),
  showName: z.string().nullable(),
  episodes: z.array(WhatsNextEpisodeSchema),
}).openapi('ToResearchSeries');

const ToResearchSectionSchema = z.object({
  series: z.array(ToResearchSeriesSchema),
}).openapi('ToResearchSection');

// Schema for the 'Waiting & Generating' section counts
export const WaitingAndGeneratingSectionSchema = z.object({
  materialGenerated: z.number().openapi({ example: 5 }),
  generatingVideo: z.number().openapi({ example: 2 }),
}).openapi('WaitingAndGeneratingSection');

// The main response schema for the 'What's Next' endpoint
export const WhatsNextResponseSchema = z.object({
  toGenerateMaterial: EpisodeListSectionSchema,
  waitingAndGenerating: WaitingAndGeneratingSectionSchema,
  toPublishOnYouTube: EpisodeListSectionSchema,
  toPublishOnX: EpisodeListSectionSchema,
  toResearch: ToResearchSectionSchema,
}).openapi('WhatsNextResponse');

