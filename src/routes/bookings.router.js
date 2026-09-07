import { Router } from 'express';
import BookingManager from '../managers/BookingManager.js';

const router = Router();
const bookingManager = new BookingManager();

router.post('/', async (req, res) => {
  try {
    const newBooking = await bookingManager.createBooking(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:bid', async (req, res) => {
  const { bid } = req.params;
  const booking = await bookingManager.getBookingById(bid);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json(booking);
});

router.post('/:bid/services/:sid', async (req, res) => {
  const { bid, sid } = req.params;
  const result = await bookingManager.addServiceToBooking(bid, sid);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.json(result.booking);
});

export default router;