import ServicesDAO from './dao/services.dao.js';
import ServicesRepository from './repositories/services.repository.js';
import ServicesService from './services/services.service.js';
import BookingsDAO from './dao/bookings.dao.js';
import BookingsRepository from './repositories/bookings.repository.js';
import BookingsService from './services/bookings.service.js';
import MessagesDAO from './dao/messages.dao.js';
import MessagesRepository from './repositories/messages.repository.js';
import MessagesService from './services/messages.service.js';

export const servicesService = new ServicesService(
  new ServicesRepository(new ServicesDAO())
);

export const bookingsService = new BookingsService(
  new BookingsRepository(new BookingsDAO()),
  servicesService
);

export const messagesService = new MessagesService(
  new MessagesRepository(new MessagesDAO())
);
