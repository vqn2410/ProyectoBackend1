class MessagesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() {
    return this.dao.getAll();
  }

  getById(id) {
    return this.dao.getById(id);
  }

  create(message) {
    return this.dao.create(message);
  }
}

export default MessagesRepository;
