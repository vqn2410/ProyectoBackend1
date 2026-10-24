import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  addServiceToBooking,
  updateServiceQuantityInBooking,
  removeServiceFromBooking
} from '../controllers/bookings.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  bookingIdParamSchema,
  createBookingSchema,
  updateBookingSchema,
  serviceInBookingParamsSchema,
  updateServiceInBookingSchema
} from '../validators/booking.validator.js';

const router = Router();

// CRUD completo de reservas
router.get('/', getBookings);
router.get('/:bid', validate(bookingIdParamSchema, 'params'), getBookingById);
router.post('/', validate(createBookingSchema), createBooking);
router.put(
  '/:bid',
  validate(bookingIdParamSchema, 'params'),
  validate(updateBookingSchema),
  updateBooking
);
router.patch(
  '/:bid',
  validate(bookingIdParamSchema, 'params'),
  validate(updateBookingSchema),
  updateBooking
);
router.delete('/:bid', validate(bookingIdParamSchema, 'params'), deleteBooking);

// Gestión de servicios dentro de una reserva
router.post(
  '/:bid/services/:sid',
  validate(serviceInBookingParamsSchema, 'params'),
  addServiceToBooking
);
router.put(
  '/:bid/services/:sid',
  validate(serviceInBookingParamsSchema, 'params'),
  validate(updateServiceInBookingSchema),
  updateServiceQuantityInBooking
);
router.patch(
  '/:bid/services/:sid',
  validate(serviceInBookingParamsSchema, 'params'),
  validate(updateServiceInBookingSchema),
  updateServiceQuantityInBooking
);
router.delete(
  '/:bid/services/:sid',
  validate(serviceInBookingParamsSchema, 'params'),
  removeServiceFromBooking
);

export default router;
