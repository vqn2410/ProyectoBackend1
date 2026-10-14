const SORTABLE_FIELDS = ['name', 'description', 'category', 'duration', 'price', 'available'];

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function buildFilter({ category, available } = {}) {
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (available !== undefined && available !== '') {
    filter.available = available === 'true' || available === true;
  }

  return filter;
}

function buildOptions(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const sortBy = SORTABLE_FIELDS.includes(query.sortBy) ? query.sortBy : 'name';
  const order = query.order === 'desc' ? -1 : 1;

  return {
    page,
    limit,
    sort: { [sortBy]: order }
  };
}

class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(query = {}) {
    const filter = buildFilter(query);
    const { page, limit, sort } = buildOptions(query);
    const skip = (page - 1) * limit;

    const { services, total } = await this.repository.getAll({
      filter,
      sort,
      skip,
      limit
    });

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      status: 'success',
      payload: services,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    };
  }

  async getAllServices() {
    const { services } = await this.repository.getAll({ sort: { name: 1 } });
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
