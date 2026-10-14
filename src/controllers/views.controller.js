import { servicesService, bookingsService } from '../container.js';
import { resolveError } from '../utils/error.util.js';

export async function getServicesView(req, res) {
  try {
    const services = await servicesService.getServices();
    res.render('services', { title: 'Servicios', services });
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to render services view');
    res.status(statusCode).send(message);
  }
}

export async function getAvailabilityView(req, res) {
  try {
    const bookings = await bookingsService.getBookings();
    res.render('availability', { title: 'Disponibilidad', bookings });
  } catch (error) {
    const { statusCode, message } = resolveError(error, 'Unable to render availability view');
    res.status(statusCode).send(message);
  }
}
