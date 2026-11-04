import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { createAppointment, listAppointments } from '../services/appointmentService';
import { buildBookingConfirmation } from '../services/bookingConfirmationService';

const router = Router();

router.get('/appointments', authenticate, authorizeRoles('owner', 'manager', 'receptionist', 'stylist', 'super-admin'), (_req, res) => {
  res.json({
    message: 'Appointments fetched successfully',
    appointments: listAppointments(),
  });
});

router.post('/appointments', authenticate, authorizeRoles('owner', 'manager', 'receptionist', 'customer', 'super-admin'), (req, res) => {
  const { customerName, serviceId, stylist, time, branchId } = req.body ?? {};

  if (!customerName || !serviceId || !time) {
    return res.status(400).json({
      message: 'customerName, serviceId and time are required',
      status: 'error',
    });
  }

  const booking = createAppointment({
    customerName: String(customerName),
    serviceId: String(serviceId),
    stylist: stylist ? String(stylist) : undefined,
    time: String(time),
    branchId: branchId ? String(branchId) : undefined,
  });

  const confirmation = buildBookingConfirmation({
    customerName: String(customerName),
    service: booking.service,
    stylist: booking.stylist,
    time: booking.time,
    branchId: booking.branchId,
  });

  return res.status(201).json({
    message: 'Appointment booked successfully',
    status: 'success',
    booking,
    confirmation,
  });
});

export default router;
