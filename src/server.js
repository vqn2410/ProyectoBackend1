import http from 'http';
import app from './app.js';
import config from './config/env.config.js';
import { connectDB } from './config/db.config.js';
import { initSocket } from './config/socket.config.js';

const server = http.createServer(app);
initSocket(server);

const PORT = config.PORT;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Modo: ${config.NODE_ENV}`);
    });
  })
  .catch(error => {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  });
