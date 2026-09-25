import { randomUUID } from 'crypto';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

class BookingsService {
  constructor(repository, servicesService) {
    this.repository = repository;
    this.servicesService = servicesService;
  }

  async createBooking(data = {}) {
    const requiredFields = ['clientName', 'clientEmail', 'date', 'time'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw createError(`Missing required field: ${field}`, 400);
      }
    }

    return this.repository.create({
      id: randomUUID(),
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      time: data.time,
      status: data.status || 'pending',
      services: []
    });
  }

  getBookingById(id) {
    return this.repository.getById(id);
  }

  async addServiceToBooking(bookingId, serviceId) {
    const booking = await this.repository.getById(bookingId);
    if (!booking) {
      throw createError('Booking not found', 404);
    }

    const service = await this.servicesService.getServiceById(serviceId);
    if (!service) {
      throw createError('Service not found', 404);
    }

    const bookingService = booking.services.find(item => item.service === serviceId);
    if (bookingService) {
      bookingService.quantity += 1;
    } else {
      booking.services.push({ service: serviceId, quantity: 1 });
    }

    return this.repository.update(bookingId, { services: booking.services });
  }
}

export default BookingsService;
