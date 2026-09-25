import ServicesDAO from '../dao/services.dao.js';
import ServicesRepository from '../repositories/services.repository.js';
import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService(
  new ServicesRepository(new ServicesDAO())
);

export async function getServices(req, res) {
  try {
    const services = await servicesService.getServices(req.query);
    res.status(200).json(services);
  } catch {
    res.status(500).json({ error: 'Unable to retrieve services' });
  }
}

export async function getServiceById(req, res) {
  try {
    const service = await servicesService.getServiceById(req.params.sid);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(service);
  } catch {
    res.status(500).json({ error: 'Unable to retrieve service' });
  }
}

export async function createService(req, res) {
  try {
    const service = await servicesService.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Unable to create service'
    });
  }
}

export async function updateService(req, res) {
  try {
    const service = await servicesService.updateService(req.params.sid, req.body);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(service);
  } catch {
    res.status(500).json({ error: 'Unable to update service' });
  }
}

export async function deleteService(req, res) {
  try {
    const service = await servicesService.deleteService(req.params.sid);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(service);
  } catch {
    res.status(500).json({ error: 'Unable to delete service' });
  }
}
