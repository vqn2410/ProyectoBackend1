import mongoose from 'mongoose';
import Message from '../models/message.model.js';

class MessagesDAO {
  async getAll() {
    const messages = await Message.find();
    return messages.map(message => message.toJSON());
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const message = await Message.findById(id);
    return message ? message.toJSON() : null;
  }

  async create(data) {
    const message = await Message.create(data);
    return message.toJSON();
  }
}

export default MessagesDAO;
