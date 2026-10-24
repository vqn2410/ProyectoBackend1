class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll(options) {
    return this.dao.getAll(options);
  }

  create(booking) {
    return this.dao.create(booking);
  }

  getById(id, options) {
    return this.dao.getById(id, options);
  }

  update(id, data) {
    return this.dao.update(id, data);
  }

  delete(id) {
    return this.dao.delete(id);
  }
}

export default BookingsRepository;
