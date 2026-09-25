import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const DATA_FILE = fileURLToPath(new URL('../data/bookings.json', import.meta.url));

class BookingsDAO {
  async readFile() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeFile(bookings) {
    await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  }

  async create(booking) {
    const bookings = await this.readFile();
    bookings.push(booking);
    await this.writeFile(bookings);
    return booking;
  }

  async getById(id) {
    const bookings = await this.readFile();
    return bookings.find(booking => booking.id === id) || null;
  }

  async update(id, data) {
    const bookings = await this.readFile();
    const index = bookings.findIndex(booking => booking.id === id);

    if (index === -1) {
      return null;
    }

    bookings[index] = { ...bookings[index], ...data, id: bookings[index].id };
    await this.writeFile(bookings);
    return bookings[index];
  }
}

export default BookingsDAO;
