import { Router } from 'express';
import ServiceManager from '../managers/ServiceManager.js';

const router = Router();
const serviceManager = new ServiceManager();

router.get('/', async (req, res) => {
  const services = await serviceManager.getServices();

  let result = services;
  if (req.query.category) {
    result = result.filter(service => service.category === req.query.category);
  }

  if (req.query.available !== undefined) {
    const isAvailable = req.query.available === 'true';
    result = result.filter(service => service.available === isAvailable);
  }

  res.json(result);
});

router.get('/:sid', async (req, res) => {
  const { sid } = req.params;
  const service = await serviceManager.getServiceById(sid);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(service);
});

router.post('/', async (req, res) => {
  try {
    const newService = await serviceManager.addService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:sid', async (req, res) => {
  const { sid } = req.params;
  const updatedService = await serviceManager.updateService(sid, req.body);

  if (!updatedService) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(updatedService);
});

router.delete('/:sid', async (req, res) => {
  const { sid } = req.params;
  const deletedService = await serviceManager.deleteService(sid);

  if (!deletedService) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(deletedService);
});

export default router;