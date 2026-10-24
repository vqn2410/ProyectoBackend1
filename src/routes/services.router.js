import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  serviceIdParamSchema,
  createServiceSchema,
  updateServiceSchema
} from '../validators/service.validator.js';

const router = Router();

router.get('/', getServices);
router.get('/:sid', validate(serviceIdParamSchema, 'params'), getServiceById);
router.post('/', validate(createServiceSchema), createService);
router.put(
  '/:sid',
  validate(serviceIdParamSchema, 'params'),
  validate(updateServiceSchema),
  updateService
);
router.delete(
  '/:sid',
  validate(serviceIdParamSchema, 'params'),
  deleteService
);

export default router;
