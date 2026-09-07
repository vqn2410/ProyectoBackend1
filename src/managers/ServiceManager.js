import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const DATA_FILE = fileURLToPath(new URL('../data/services.json', import.meta.url));

class ServiceManager {
  async readFile() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeFile(services) {
    await fs.writeFile(DATA_FILE, JSON.stringify(services, null, 2), 'utf-8');
  }

  async getServices() {
    return this.readFile();
  }

  async getServiceById(sid) {
    const services = await this.readFile();
    return services.find(service => service.id === sid) || null;
  }

  async addService(data) {
    const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'available'];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof data.duration !== 'number' || data.duration <= 0) {
      throw new Error('duration must be a positive number');
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new Error('price must be a positive number');
    }

    const newService = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      category: data.category,
      available: data.available
    };

    const services = await this.readFile();
    services.push(newService);
    await this.writeFile(services);
    return newService;
  }

  async updateService(sid, data) {
    const services = await this.readFile();
    const index = services.findIndex(service => service.id === sid);

    if (index === -1) {
      return null;
    }

    const { id, ...updateData } = data;
    services[index] = { id: services[index].id, ...services[index], ...updateData };
    await this.writeFile(services);
    return services[index];
  }

  async deleteService(sid) {
    const services = await this.readFile();
    const index = services.findIndex(service => service.id === sid);

    if (index === -1) {
      return null;
    }

    const deleted = services.splice(index, 1);
    await this.writeFile(services);
    return deleted[0];
  }
}

export default ServiceManager;