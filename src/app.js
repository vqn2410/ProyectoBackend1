import express from 'express';
import servicesRouter from './routes/services.router.js';

const app = express();

app.use(express.json());

app.use('/api/services', servicesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Sistema Backend de Turnos y Reservas - API' });
});

export default app;
