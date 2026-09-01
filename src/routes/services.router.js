import { Router } from 'express';
import ServiceManager from '../managers/ServiceManager.js';

const router = Router();
const serviceManager = new ServiceManager();

router.get('/', (req, res) => {
  const filters = {
    category: req.query.category,
    available: req.query.available
  };

  const services = serviceManager.getAll(filters);
  res.json(services);
});

router.get('/:sid', (req, res) => {
  const { sid } = req.params;
  const service = serviceManager.getById(sid);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(service);
});

router.post('/', (req, res) => {
  try {
    const newService = serviceManager.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:sid', (req, res) => {
  const { sid } = req.params;
  const updatedService = serviceManager.update(sid, req.body);

  if (!updatedService) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(updatedService);
});

router.delete('/:sid', (req, res) => {
  const { sid } = req.params;
  const deletedService = serviceManager.delete(sid);

  if (!deletedService) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(deletedService);
});

export default router;
