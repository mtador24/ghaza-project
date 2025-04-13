
// This script starts the API server
import('./src/server/index.js')
  .then(() => {
    console.log('API server started successfully');
  })
  .catch((error) => {
    console.error('Error starting API server:', error);
  });
