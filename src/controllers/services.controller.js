import ServiceManager from '../managers/ServiceManager.js';

const serviceManager = new ServiceManager();

export async function getServices(req, res) {
  const services = await serviceManager.getServices();
  let result = services;

  if (req.query.category) {
    result = result.filter(service => service.category === req.query.category);
  }

  if (req.query.available !== undefined) {
    const isAvailable = req.query.available === 'true';
    result = result.filter(service => service.available === isAvailable);
  }

  res.status(200).json(result);
}

export async function getServiceById(req, res) {
  const service = await serviceManager.getServiceById(req.params.sid);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.status(200).json(service);
}

export async function createService(req, res) {
  try {
    const service = await serviceManager.addService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateService(req, res) {
  const service = await serviceManager.updateService(req.params.sid, req.body);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.status(200).json(service);
}

export async function deleteService(req, res) {
  const service = await serviceManager.deleteService(req.params.sid);

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.status(200).json(service);
}
