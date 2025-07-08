import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import http from 'http';
import router from './routes/index.js';
import logger from './lib/logger.js';
import { setupSwaggerDocs } from './docs/swaggerConfig.js';
import db from './models/index.js';

await db.sequelize.authenticate();
const app = express();
const server = http.createServer(app);
// hookup Swagger
setupSwaggerDocs(app);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: true })); // handles x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('Welcome to FarmLink Api');
});

// routes
app.use('/api/v1', router);

// Global error Handler
app.use((err, req, res, next) => {
  // use status from error
  const status = err.status || 500;
  // Hide internal DB errors from users
  const isSequelizeError = err.name && err.name.startsWith('Sequelize');

  const message = isSequelizeError
    ? 'A server error occurred. Please try again later.'
    : err.message || 'Internal Server Error';

  logger.error(`💥 ${err.message}`, {
    status,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });
  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Something went wrong',
    },
  });
});

export { app, server };
