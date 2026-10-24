import { Router } from 'express';
import {
  getMessages,
  getMessageById,
  createMessage
} from '../controllers/messages.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createMessageSchema,
  messageIdParamSchema
} from '../validators/message.validator.js';

const router = Router();

router.get('/', getMessages);
router.get('/:mid', validate(messageIdParamSchema, 'params'), getMessageById);
router.post('/', validate(createMessageSchema), createMessage);

export default router;
