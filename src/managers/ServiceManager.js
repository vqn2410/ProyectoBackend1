export default class ServiceManager {
  constructor() {
    this.services = [];
  }

  getServices() {
    return this.services;
  }

  getServiceById(id) {
    return this.services.find((service) => service.id === Number(id)) ?? null;
  }

  addService(serviceData) {
    const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'available'];
    const missingFields = requiredFields.filter(
      (field) => serviceData[field] === undefined || serviceData[field] === null || serviceData[field] === '',
    );

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
    }

    const lastService = this.services[this.services.length - 1];
    const newId = lastService ? lastService.id + 1 : 1;

    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };

    this.services.push(newService);
    return newService;
  }

  updateService(id, updatedData) {
    const service = this.getServiceById(id);

    if (!service) {
      return null;
    }

    const { id: ignoredId, ...allowedUpdates } = updatedData;
    Object.assign(service, allowedUpdates);
    return service;
  }

  deleteService(id) {
    const serviceIndex = this.services.findIndex((service) => service.id === Number(id));

    if (serviceIndex === -1) {
      return null;
    }

    return this.services.splice(serviceIndex, 1)[0];
  }
}
