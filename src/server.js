import app from './app.js';
import config from './config/env.config.js';
import { connectDB } from './config/db.config.js';

const PORT = config.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Modo: ${config.NODE_ENV}`);
    });
  })
  .catch(error => {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  });
