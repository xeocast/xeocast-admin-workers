import { Context } from 'hono';
import { z } from 'zod';
import { GetTokenResponseSchema, GetTokenResponse } from '../../schemas/heavyComputeApiSchemas';

export const getTokenHandler = async (c: Context): Promise<Response> => {
  const apiKey = c.env.HEAVY_COMPUTE_API_KEY as string;

  if (!apiKey) {
    console.error('HEAVY_COMPUTE_API_KEY is not set in environment variables.');
    return c.json({ error: 'Internal server error: API key not configured.' }, 500);
  }

  try {
    const responsePayload: GetTokenResponse = { token: apiKey };
    GetTokenResponseSchema.parse(responsePayload); 

    return c.json(responsePayload, 200);
  } catch (error) {
    console.error('Error preparing or validating token response:', error);
    if (error instanceof z.ZodError) {
        return c.json({ error: 'Internal server error: Invalid token data.', details: error.issues }, 500);
    }
    return c.json({ error: 'Internal server error while processing token.' }, 500);
  }
};
