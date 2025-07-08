import { server } from './main.js';
import { getEnvironmentVariable } from './config/dotenvConfig.js';
import { connectToDb } from './lib/db.js';
import logger from './lib/logger.js';

connectToDb();

// Get Port from env to start the server
const PORT = getEnvironmentVariable('PORT');

(() => {
  server.listen(PORT, () => {
    logger.info(`Server is running on PORT: ${PORT}`);
    console.log(`📘 Swagger Docs at http://localhost:${PORT}/api-docs`);
  });
})();
