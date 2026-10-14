import { servicesService } from '../container.js';
import { broadcast } from '../config/socket.config.js';
import { resolveError } from '../utils/error.util.js';

export async function getServices(req, res) {
  try {
    const services = await servicesService.getServices(req.query);
    res.status(200).json(services);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to retrieve services');
    res.status(statusCode).json({ error: message });
  }
}

export async function getServiceById(req, res) {
  try {
    const service = await servicesService.getServiceById(req.params.sid);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to retrieve service');
    res.status(statusCode).json({ error: message });
  }
}

export async function createService(req, res) {
  try {
    const service = await servicesService.createService(req.body);
    broadcast('service:created', service);
    res.status(201).json(service);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to create service');
    res.status(statusCode).json({ error: message });
  }
}

export async function updateService(req, res) {
  try {
    const service = await servicesService.updateService(req.params.sid, req.body);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    broadcast('service:updated', service);
    res.status(200).json(service);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to update service');
    res.status(statusCode).json({ error: message });
  }
}

export async function deleteService(req, res) {
  try {
    const service = await servicesService.deleteService(req.params.sid);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    broadcast('service:deleted', { id: req.params.sid });
    res.status(200).json(service);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to delete service');
    res.status(statusCode).json({ error: message });
  }
}
