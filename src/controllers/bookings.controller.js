import BookingManager from '../managers/BookingManager.js';
import ServiceManager from '../managers/ServiceManager.js';

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

export async function createBooking(req, res) {
  try {
    const booking = await bookingManager.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getBookingById(req, res) {
  const booking = await bookingManager.getBookingById(req.params.bid);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.status(200).json(booking);
}

export async function addServiceToBooking(req, res) {
  const { bid, sid } = req.params;
  const booking = await bookingManager.getBookingById(bid);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const service = await serviceManager.getServiceById(sid);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const updatedBooking = await bookingManager.addServiceToBooking(bid, sid);
  res.status(200).json(updatedBooking);
}
