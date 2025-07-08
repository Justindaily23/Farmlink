import { server } from './main.js';
import { getEnvironmentVariable } from './config/dotenvConfig.js';
import { connectToDb } from './lib/db.js';
import logger from './lib/logger.js';

connectToDb();

// Get Port from env to start the server
const PORT = getEnvironmentVariable('PORT');
const SWAGGER_BASE_URL = getEnvironmentVariable('SWAGGER_BASE_URL');

(() => {
  server.listen(PORT, () => {
    logger.info(`Server is running on PORT: ${PORT}`);
    console.log(`📘 Swagger Docs at ${SWAGGER_BASE_URL}/api-docs`);
  });
})();
