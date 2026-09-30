function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

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
    if (!data.user) {
      throw createError('Missing required field: user', 400);
    }

    if (!data.message) {
      throw createError('Missing required field: message', 400);
    }

    return this.repository.create({
      user: data.user,
      message: data.message,
      createdAt: data.createdAt || new Date()
    });
  }
}

export default MessagesService;
