import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { getEnvironmentVariable } from '../config/dotenvConfig.js';

// Initialize Swagger documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FarmLink API',
      version: '1.0.0',
      description: 'API documentation for FarmLink application',
    },
    servers: [
      {
        url: getEnvironmentVariable('SWAGGER_BASE_URL'),
      },
    ],
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: ['./src/routes/**/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);
export const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
