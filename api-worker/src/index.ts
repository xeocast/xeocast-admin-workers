// src/index.ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';

// Import routes
import authRoutes from './routes/auth.routes';
import showRoutes from './routes/shows.routes';
import episodeRoutes from './routes/episodes.routes';
import userRoutes from './routes/users.routes';
import roleRoutes from './routes/roles.routes';
import seriesRoutes from './routes/series.routes';
import externalTaskRoutes from './routes/external-tasks.routes';
import youtubeChannelRoutes from './routes/youtube-channels.routes';
import youtubePlaylistRoutes from './routes/youtube-playlists.routes';
import storageRoutes from './routes/storage.routes';
import heavyComputeApiRoutes from './routes/heavy-compute-api.routes';

// Import middleware
import { ensureAuth } from './middlewares/auth.middleware';

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();
const authMiddleware = ensureAuth(); // ensure authMiddleware is defined before use

// CORS Middleware
app.use('*', (c, next) => {
  const middleware = cors({
    origin: (origin) => {
      const allowedDevelopmentOrigin = 'http://localhost:8080';
      const allowedProductionOrigin = 'https://dash.xeocast.com';

      if (c.env.ENVIRONMENT === 'production') {
        return origin === allowedProductionOrigin ? origin : null;
      }
      // Allow requests from localhost for development, and also allow requests with no origin (e.g. curl, Postman)
      return origin === allowedDevelopmentOrigin || !origin ? origin || allowedDevelopmentOrigin : null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-Requested-With', 'Cookie', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  });
  return middleware(c, next);
});

// Public routes first
app.route('/auth', authRoutes);

// Apply auth middleware to protected route paths
app.use('/shows/*', authMiddleware);
app.use('/episodes/*', authMiddleware);
app.use('/users/*', authMiddleware);
app.use('/roles/*', authMiddleware);
app.use('/series/*', authMiddleware);
app.use('/external-tasks/*', authMiddleware);
app.use('/youtube-channels/*', authMiddleware);
app.use('/youtube-playlists/*', authMiddleware);
app.use('/storage/*', authMiddleware);
app.use('/heavy-compute-api/*', authMiddleware);

// Mount protected routes
app.route('/shows', showRoutes);
app.route('/episodes', episodeRoutes);
app.route('/users', userRoutes);
app.route('/roles', roleRoutes);
app.route('/series', seriesRoutes);
app.route('/external-tasks', externalTaskRoutes);
app.route('/youtube-channels', youtubeChannelRoutes);
app.route('/youtube-playlists', youtubePlaylistRoutes);
app.route('/storage', storageRoutes);
app.route('/heavy-compute-api', heavyComputeApiRoutes);

// OpenAPI Documentation
app.doc('/doc', {
  openapi: '3.1.0',
  info: {
    version: '1.0.1',
    title: 'Xeocast Admin API',
    description: 'API for managing Xeocast episode content and users.',
  },
  servers: [
    {
      url: 'http://localhost:8787', // Adjust if your local dev server is different
      description: 'Local development server'
    },
    // Add production server URL here when available
  ]
});

// A simple root message
app.get('/', (c) => c.text('Xeocast Admin API Worker is running. Visit /api/ui for documentation.'));

// Swagger UI
app.get('/doc/ui', swaggerUI({ url: '/doc' }));

export default app;

