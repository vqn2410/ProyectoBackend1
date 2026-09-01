import app from './app.js';
import config from './config/env.config.js';

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Modo: ${config.NODE_ENV}`);
});
