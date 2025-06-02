import { Hono } from 'hono';
import { getTokenHandler } from '../handlers/heavyComputeApi/getToken.handler';

const heavyComputeApi = new Hono();

// This endpoint is designed to be called from your frontend to securely obtain 
// the HEAVY_COMPUTE_API_KEY. Ensure appropriate security measures are in place 
// for the overall application if this key grants significant access.
heavyComputeApi.get('/get-token', getTokenHandler);

export default heavyComputeApi;
