class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() {
    return this.dao.getAll();
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
}

export default BookingsRepository;
