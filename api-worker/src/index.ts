// src/index.ts
import { OpenAPIHono } from '@hono/zod-openapi';
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

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

// API routes
const apiRoutes = app
  .route('/auth', authRoutes)
  .route('/categories', categoryRoutes)
  .route('/podcasts', podcastRoutes)
  .route('/users', userRoutes)
  .route('/roles', roleRoutes)
  .route('/series', seriesRoutes)
  .route('/external-tasks', externalTaskRoutes)
  .route('/youtube-channels', youtubeChannelRoutes)
  .route('/youtube-playlists', youtubePlaylistRoutes);

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

