class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(booking) {
    return this.dao.create(booking);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  update(id, data) {
    return this.dao.update(id, data);
  }
}

export default BookingsRepository;
