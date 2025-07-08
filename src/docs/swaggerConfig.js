import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        url: 'http://localhost:5000/api/v1',
      },
    ],
  },
  apis: ['./src/routes/**/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);
export const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
