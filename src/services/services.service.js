import { randomUUID } from 'crypto';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(filters = {}) {
    let services = await this.repository.getAll();

    if (filters.category) {
      services = services.filter(service => service.category === filters.category);
    }

    if (filters.available !== undefined) {
      const isAvailable = filters.available === 'true';
      services = services.filter(service => service.available === isAvailable);
    }

    return services;
  }

  getServiceById(id) {
    return this.repository.getById(id);
  }

  async createService(data = {}) {
    const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'available'];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw createError(`Missing required field: ${field}`, 400);
      }
    }

    if (typeof data.duration !== 'number' || data.duration <= 0) {
      throw createError('duration must be a positive number', 400);
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
      throw createError('price must be a positive number', 400);
    }

    return this.repository.create({
      id: randomUUID(),
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      category: data.category,
      available: data.available
    });
  }

  updateService(id, data = {}) {
    const { id: ignoredId, ...updateData } = data;
    return this.repository.update(id, updateData);
  }

  deleteService(id) {
    return this.repository.delete(id);
  }
}

export default ServicesService;
