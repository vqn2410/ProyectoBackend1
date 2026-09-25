import BookingsDAO from '../dao/bookings.dao.js';
import BookingsRepository from '../repositories/bookings.repository.js';
import BookingsService from '../services/bookings.service.js';
import ServicesDAO from '../dao/services.dao.js';
import ServicesRepository from '../repositories/services.repository.js';
import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService(
  new ServicesRepository(new ServicesDAO())
);
const bookingsService = new BookingsService(
  new BookingsRepository(new BookingsDAO()),
  servicesService
);

export async function createBooking(req, res) {
  try {
    const booking = await bookingsService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Unable to create booking'
    });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await bookingsService.getBookingById(req.params.bid);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch {
    res.status(500).json({ error: 'Unable to retrieve booking' });
  }
}

export async function addServiceToBooking(req, res) {
  try {
    const booking = await bookingsService.addServiceToBooking(
      req.params.bid,
      req.params.sid
    );
    res.status(200).json(booking);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Unable to add service to booking'
    });
  }
}
