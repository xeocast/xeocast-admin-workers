// api-worker/src/schemas/maintenanceSchemas.ts
import { z } from 'zod';

const BatchProcessDetailSchema = z.object({
  successCount: z.number().int().min(0).openapi({example: 10}),
  errorCount: z.number().int().min(0).openapi({example: 1}),
  errors: z.array(z.string()).openapi({example: ["Failed to update series 123: Slug already exists."]})
});

const RegenerateDetailsSchema = z.object({
  shows: BatchProcessDetailSchema,
  series: BatchProcessDetailSchema,
  episodes: BatchProcessDetailSchema,
});

export const RegenerateSlugsSuccessResponseSchema = z.object({
  message: z.string().openapi({example: "Slug regeneration completed successfully for 150 items."}),
  details: RegenerateDetailsSchema,
  errors: z.array(z.string()).optional().openapi({description: "Only present if there were errors, typically empty on 200 OK."}),
});

export const RegenerateSlugsMultiStatusResponseSchema = z.object({
  message: z.string().openapi({example: "Slug regeneration completed with 5 errors and 145 successes."}),
  details: RegenerateDetailsSchema,
  errors: z.array(z.string()).optional().openapi({example: ["Failed to update series 123: Slug already exists.", "Error processing episode 45: Network timeout"]}),
});
