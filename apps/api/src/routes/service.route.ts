import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { createService, deleteService, getServiceById, listServices, updateService } from '../services/serviceService';

const router = Router();

router.get('/services', async (_req, res) => {
  res.json({
    message: 'Service catalog fetched successfully',
    services: listServices(),
  });
});

router.get('/services/:id', async (req, res) => {
  const serviceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const service = getServiceById(serviceId);

  if (!service) {
    return res.status(404).json({
      message: 'Service not found',
      status: 'error',
    });
  }

  return res.json({
    message: 'Service fetched successfully',
    service,
  });
});

router.post('/services', authenticate, authorizeRoles('owner', 'manager', 'super-admin'), (req, res) => {
  const { name, duration, price } = req.body ?? {};

  if (!name || duration === undefined || price === undefined) {
    return res.status(400).json({
      message: 'name, duration and price are required',
      status: 'error',
    });
  }

  const service = createService({
    name: String(name),
    duration: Number(duration),
    price: Number(price),
  });

  return res.status(201).json({
    message: 'Service created successfully',
    status: 'success',
    service,
  });
});

router.put('/services/:id', authenticate, authorizeRoles('owner', 'manager', 'super-admin'), (req, res) => {
  const serviceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { name, duration, price } = req.body ?? {};
  const updated = updateService(serviceId, {
    name: name !== undefined ? String(name) : undefined,
    duration: duration !== undefined ? Number(duration) : undefined,
    price: price !== undefined ? Number(price) : undefined,
  });

  if (!updated) {
    return res.status(404).json({
      message: 'Service not found',
      status: 'error',
    });
  }

  return res.json({
    message: 'Service updated successfully',
    status: 'success',
    service: updated,
  });
});

router.delete('/services/:id', authenticate, authorizeRoles('owner', 'manager', 'super-admin'), (req, res) => {
  const serviceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = deleteService(serviceId);

  if (!deleted) {
    return res.status(404).json({
      message: 'Service not found',
      status: 'error',
    });
  }

  return res.json({
    message: 'Service deleted successfully',
    status: 'success',
  });
});

export default router;
