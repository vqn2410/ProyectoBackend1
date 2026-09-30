import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';

class BookingsDAO {
  async create(data) {
    const booking = await Booking.create(data);
    return booking.toJSON();
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const booking = await Booking.findById(id);
    return booking ? booking.toJSON() : null;
  }

  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const booking = await Booking.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true
    });
    return booking ? booking.toJSON() : null;
  }
}

export default BookingsDAO;
