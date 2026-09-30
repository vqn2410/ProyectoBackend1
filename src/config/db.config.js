import mongoose from 'mongoose';
import config from './env.config.js';

export async function connectDB() {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI no está definida en las variables de entorno');
  }

  await mongoose.connect(config.MONGO_URI);
  console.log('Conexión a MongoDB establecida');
}
