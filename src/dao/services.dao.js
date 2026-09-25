import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const DATA_FILE = fileURLToPath(new URL('../data/services.json', import.meta.url));

class ServicesDAO {
  async readFile() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeFile(services) {
    await fs.writeFile(DATA_FILE, JSON.stringify(services, null, 2), 'utf-8');
  }

  async getAll() {
    return this.readFile();
  }

  async getById(id) {
    const services = await this.readFile();
    return services.find(service => service.id === id) || null;
  }

  async create(service) {
    const services = await this.readFile();
    services.push(service);
    await this.writeFile(services);
    return service;
  }

  async update(id, data) {
    const services = await this.readFile();
    const index = services.findIndex(service => service.id === id);

    if (index === -1) {
      return null;
    }

    services[index] = { ...services[index], ...data, id: services[index].id };
    await this.writeFile(services);
    return services[index];
  }

  async delete(id) {
    const services = await this.readFile();
    const index = services.findIndex(service => service.id === id);

    if (index === -1) {
      return null;
    }

    const [deleted] = services.splice(index, 1);
    await this.writeFile(services);
    return deleted;
  }
}

export default ServicesDAO;
