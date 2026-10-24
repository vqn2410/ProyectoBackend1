class MessagesService {
  constructor(repository) {
    this.repository = repository;
  }

  getMessages() {
    return this.repository.getAll();
  }

  getMessageById(id) {
    return this.repository.getById(id);
  }

  async createMessage(data = {}) {
    return this.repository.create({
      user: data.user,
      message: data.message,
      createdAt: data.createdAt || new Date()
    });
  }
}

export default MessagesService;
