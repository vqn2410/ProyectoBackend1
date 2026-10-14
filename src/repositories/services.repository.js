class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll(options) {
    return this.dao.getAll(options);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  create(service) {
    return this.dao.create(service);
  }

  update(id, data) {
    return this.dao.update(id, data);
  }

  delete(id) {
    return this.dao.delete(id);
  }
}

export default ServicesRepository;
