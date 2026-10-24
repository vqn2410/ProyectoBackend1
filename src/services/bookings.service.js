function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getServiceIdFromItem(item) {
  if (!item || !item.service) return '';
  return String(item.service.id || item.service._id || item.service);
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
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      time: data.time,
      status: data.status || 'pending',
      services: []
    });
  }

  getBookings(options) {
    return this.repository.getAll(options);
  }

  getBookingById(id, options) {
    return this.repository.getById(id, options);
  }

  async updateBooking(id, data = {}) {
    const { id: ignoredId, ...updateData } = data;
    return this.repository.update(id, updateData);
  }

  async deleteBooking(id) {
    return this.repository.delete(id);
  }

  async addServiceToBooking(bookingId, serviceId, quantity = 1) {
    const booking = await this.repository.getById(bookingId);
    if (!booking) {
      throw createError('Booking not found', 404);
    }

    const service = await this.servicesService.getServiceById(serviceId);
    if (!service) {
      throw createError('Service not found', 404);
    }

    const qtyToAdd = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    const bookingService = booking.services.find(
      item => getServiceIdFromItem(item) === String(serviceId)
    );

    if (bookingService) {
      bookingService.quantity += qtyToAdd;
    } else {
      booking.services.push({ service: serviceId, quantity: qtyToAdd });
    }

    return this.repository.update(bookingId, { services: booking.services });
  }

  async updateServiceQuantityInBooking(bookingId, serviceId, quantity) {
    const booking = await this.repository.getById(bookingId);
    if (!booking) {
      throw createError('Booking not found', 404);
    }

    const bookingService = booking.services.find(
      item => getServiceIdFromItem(item) === String(serviceId)
    );

    if (!bookingService) {
      throw createError('Service not found in booking', 404);
    }

    bookingService.quantity = quantity;

    return this.repository.update(bookingId, { services: booking.services });
  }

  async removeServiceFromBooking(bookingId, serviceId) {
    const booking = await this.repository.getById(bookingId);
    if (!booking) {
      throw createError('Booking not found', 404);
    }

    const exists = booking.services.some(
      item => getServiceIdFromItem(item) === String(serviceId)
    );

    if (!exists) {
      throw createError('Service not found in booking', 404);
    }

    booking.services = booking.services.filter(
      item => getServiceIdFromItem(item) !== String(serviceId)
    );

    return this.repository.update(bookingId, { services: booking.services });
  }
}

export default BookingsService;
