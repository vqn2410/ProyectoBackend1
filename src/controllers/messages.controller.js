import { messagesService } from '../container.js';
import { resolveError } from '../utils/error.util.js';

export async function getMessages(req, res) {
  try {
    const messages = await messagesService.getMessages();
    res.status(200).json(messages);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to retrieve messages');
    res.status(statusCode).json({ error: message });
  }
}

export async function getMessageById(req, res) {
  try {
    const message = await messagesService.getMessageById(req.params.mid);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to retrieve message');
    res.status(statusCode).json({ error: message });
  }
}

export async function createMessage(req, res) {
  try {
    const message = await messagesService.createMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to create message');
    res.status(statusCode).json({ error: message });
  }
}
