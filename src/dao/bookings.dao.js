import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';

class BookingsDAO {
  async getAll({ populate = false } = {}) {
    const query = Booking.find().sort({ date: 1, time: 1 });
    if (populate) {
      query.populate('services.service');
    }

    const bookings = await query;
    return bookings.map(booking => {
      const plain = booking.toJSON();
      if (populate) {
        plain.services = (booking.services || []).map(item => ({
          service: item.service ? item.service.toJSON() : null,
          quantity: item.quantity
        }));
      }
      return plain;
    });
  }

  async create(data) {
    const booking = await Booking.create(data);
    return booking.toJSON();
  }

  async getById(id, { populate = false } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const query = Booking.findById(id);
    if (populate) {
      query.populate('services.service');
    }

    const booking = await query;
    if (!booking) {
      return null;
    }

    const plain = booking.toJSON();

    if (populate) {
      plain.services = (booking.services || []).map(item => ({
        service: item.service ? item.service.toJSON() : null,
        quantity: item.quantity
      }));
    }

    return plain;
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

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const booking = await Booking.findByIdAndDelete(id);
    return booking ? booking.toJSON() : null;
  }
}

export default BookingsDAO;
