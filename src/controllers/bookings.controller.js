import { bookingsService } from '../container.js';
import { broadcast } from '../config/socket.config.js';
import { resolveError } from '../utils/error.util.js';

export async function createBooking(req, res) {
  try {
    const booking = await bookingsService.createBooking(req.body);
    broadcast('booking:created', booking);
    res.status(201).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to create booking');
    res.status(statusCode).json({ error: message });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await bookingsService.getBookingById(req.params.bid);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to retrieve booking');
    res.status(statusCode).json({ error: message });
  }
}

export async function addServiceToBooking(req, res) {
  try {
    const booking = await bookingsService.addServiceToBooking(
      req.params.bid,
      req.params.sid
    );
    broadcast('booking:updated', booking);
    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to add service to booking');
    res.status(statusCode).json({ error: message });
  }
}
