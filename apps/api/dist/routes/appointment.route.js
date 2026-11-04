"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const appointmentService_1 = require("../services/appointmentService");
const bookingConfirmationService_1 = require("../services/bookingConfirmationService");
const router = (0, express_1.Router)();
router.get('/appointments', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'receptionist', 'stylist', 'super-admin'), (_req, res) => {
    res.json({
        message: 'Appointments fetched successfully',
        appointments: (0, appointmentService_1.listAppointments)(),
    });
});
router.post('/appointments', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'receptionist', 'customer', 'super-admin'), (req, res) => {
    const { customerName, serviceId, stylist, time, branchId } = req.body ?? {};
    if (!customerName || !serviceId || !time) {
        return res.status(400).json({
            message: 'customerName, serviceId and time are required',
            status: 'error',
        });
    }
    const booking = (0, appointmentService_1.createAppointment)({
        customerName: String(customerName),
        serviceId: String(serviceId),
        stylist: stylist ? String(stylist) : undefined,
        time: String(time),
        branchId: branchId ? String(branchId) : undefined,
    });
    const confirmation = (0, bookingConfirmationService_1.buildBookingConfirmation)({
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
exports.default = router;
