import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const DATA_FILE = fileURLToPath(new URL('../data/bookings.json', import.meta.url));

class BookingManager {
  async readFile() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeFile(bookings) {
    await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  }

  async createBooking(data) {
    const requiredFields = ['clientName', 'clientEmail', 'date', 'time'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const newBooking = {
      id: randomUUID(),
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      time: data.time,
      status: data.status || 'pending',
      services: []
    };

    const bookings = await this.readFile();
    bookings.push(newBooking);
    await this.writeFile(bookings);
    return newBooking;
  }

  async getBookingById(bid) {
    const bookings = await this.readFile();
    return bookings.find(booking => booking.id === bid) || null;
  }

  async addServiceToBooking(bid, sid) {
    const bookings = await this.readFile();
    const booking = bookings.find(item => item.id === bid);

    if (!booking) {
      return null;
    }

    const existing = booking.services.find(item => item.service === sid);
    if (existing) {
      existing.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    await this.writeFile(bookings);
    return booking;
  }
}

export default BookingManager;
