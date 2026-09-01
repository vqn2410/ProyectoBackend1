import { randomUUID } from 'crypto';

class ServiceManager {
  constructor() {
    this.services = [];
  }

  getAll(filters = {}) {
    let result = [...this.services];

    if (filters.category) {
      result = result.filter(service => service.category === filters.category);
    }

    if (filters.available !== undefined) {
      const isAvailable = filters.available === 'true';
      result = result.filter(service => service.available === isAvailable);
    }

    return result;
  }

  getById(sid) {
    return this.services.find(service => service.id === sid) || null;
  }

  create(data) {
    const requiredFields = ['name', 'description', 'category', 'price'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const newService = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      available: data.available !== undefined ? data.available : true
    };

    this.services.push(newService);
    return newService;
  }

  update(sid, data) {
    const index = this.services.findIndex(service => service.id === sid);
    if (index === -1) {
      return null;
    }

    const { id, ...updateData } = data;
    this.services[index] = { ...this.services[index], ...updateData };
    return this.services[index];
  }

  delete(sid) {
    const index = this.services.findIndex(service => service.id === sid);
    if (index === -1) {
      return null;
    }

    const deleted = this.services.splice(index, 1);
    return deleted[0];
  }
}

export default ServiceManager;
