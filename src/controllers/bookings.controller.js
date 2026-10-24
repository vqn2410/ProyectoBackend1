import { bookingsService } from '../container.js';
import { broadcast } from '../config/socket.config.js';
import { resolveError } from '../utils/error.util.js';

export async function getBookings(req, res) {
  try {
    const populate = req.query.populate === 'true';
    const bookings = await bookingsService.getBookings({ populate });
    res.status(200).json(bookings);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to retrieve bookings');
    res.status(statusCode).json({ error: message });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await bookingsService.getBookingById(req.params.bid, {
      populate: true
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to retrieve booking');
    res.status(statusCode).json({ error: message });
  }
}

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

export async function updateBooking(req, res) {
  try {
    const booking = await bookingsService.updateBooking(req.params.bid, req.body);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    broadcast('booking:updated', booking);
    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to update booking');
    res.status(statusCode).json({ error: message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const booking = await bookingsService.deleteBooking(req.params.bid);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    broadcast('booking:deleted', { id: req.params.bid });
    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to delete booking');
    res.status(statusCode).json({ error: message });
  }
}

export async function addServiceToBooking(req, res) {
  try {
    const booking = await bookingsService.addServiceToBooking(
      req.params.bid,
      req.params.sid,
      req.body?.quantity
    );
    broadcast('booking:updated', booking);
    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to add service to booking');
    res.status(statusCode).json({ error: message });
  }
}

export async function updateServiceQuantityInBooking(req, res) {
  try {
    const booking = await bookingsService.updateServiceQuantityInBooking(
      req.params.bid,
      req.params.sid,
      req.body.quantity
    );
    broadcast('booking:updated', booking);
    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(
      error,
      'Unable to update service in booking'
    );
    res.status(statusCode).json({ error: message });
  }
}

export async function removeServiceFromBooking(req, res) {
  try {
    const booking = await bookingsService.removeServiceFromBooking(
      req.params.bid,
      req.params.sid
    );
    broadcast('booking:updated', booking);
    res.status(200).json(booking);
  } catch (error) {
    const { statusCode, message } = resolveError(
      error,
      'Unable to remove service from booking'
    );
    res.status(statusCode).json({ error: message });
  }
}
