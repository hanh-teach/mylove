import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

// Load configuration and environment modules early
import { config } from './server/config/config';
import { Environment } from './server/config/environment';
import videoRoutes from './server/routes/videoRoutes';
import { errorHandler } from './server/middlewares/errorHandler';
import { requestLoggerMiddleware } from './server/services/loggerService';

const app = express();
const PORT = config.port;

app.use(express.json());

// Enterprise Logging Middleware
app.use(requestLoggerMiddleware);

// Register modular router under the /api namespace
app.use('/api', videoRoutes);

// Unhandled error catcher middleware
app.use(errorHandler);

// Setup Vite dev server or static file serving
async function startServer() {
  if (!Environment.isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT} in [${Environment.current.toUpperCase()}] mode`);
  });
}

startServer();
