import mongoose from 'mongoose';
import Service from '../models/service.model.js';

class ServicesDAO {
  async getAll({ filter = {}, sort, skip = 0, limit = 0 } = {}) {
    const query = Service.find(filter);
    if (sort) query.sort(sort);
    if (skip) query.skip(skip);
    if (limit) query.limit(limit);

    const [services, total] = await Promise.all([
      query,
      Service.countDocuments(filter)
    ]);

    return { services: services.map(service => service.toJSON()), total };
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const service = await Service.findById(id);
    return service ? service.toJSON() : null;
  }

  async create(data) {
    const service = await Service.create(data);
    return service.toJSON();
  }

  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const service = await Service.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true
    });
    return service ? service.toJSON() : null;
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const service = await Service.findByIdAndDelete(id);
    return service ? service.toJSON() : null;
  }
}

export default ServicesDAO;
