// src/index.ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';

// Import routes
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import podcastRoutes from './routes/podcasts';
import userRoutes from './routes/users';
import roleRoutes from './routes/roles';
import seriesRoutes from './routes/series';
import externalTaskRoutes from './routes/externalTasks';
import youtubeChannelRoutes from './routes/youtubeChannels';
import youtubePlaylistRoutes from './routes/youtubePlaylists';
import storageRoutes from './routes/storage';
import maintenanceRoutes from './routes/maintenance'; // Added

// Import middleware
import { ensureAuth } from './middlewares/auth.middleware';

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();
const authMiddleware = ensureAuth(); // ensure authMiddleware is defined before use

// CORS Middleware
app.use('*', (c, next) => {
  const middleware = cors({
    origin: (origin) => {
      const allowedDevelopmentOrigin = 'http://localhost:4321';
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
app.use('/categories/*', authMiddleware);
app.use('/podcasts/*', authMiddleware);
app.use('/users/*', authMiddleware);
app.use('/roles/*', authMiddleware);
app.use('/series/*', authMiddleware);
app.use('/external-tasks/*', authMiddleware);
app.use('/youtube-channels/*', authMiddleware);
app.use('/youtube-playlists/*', authMiddleware);
app.use('/storage/*', authMiddleware);
app.use('/maintenance/*', authMiddleware); // Added

// Mount protected routes
app.route('/categories', categoryRoutes);
app.route('/podcasts', podcastRoutes);
app.route('/users', userRoutes);
app.route('/roles', roleRoutes);
app.route('/series', seriesRoutes);
app.route('/external-tasks', externalTaskRoutes);
app.route('/youtube-channels', youtubeChannelRoutes);
app.route('/youtube-playlists', youtubePlaylistRoutes);
app.route('/storage', storageRoutes);
app.route('/maintenance', maintenanceRoutes); // Added

// OpenAPI Documentation
app.doc('/api/doc', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Xeocast Admin API',
    description: 'API for managing Xeocast podcast content and users.',
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
app.get('/api/ui', swaggerUI({ url: '/api/doc' }));

export default app;

