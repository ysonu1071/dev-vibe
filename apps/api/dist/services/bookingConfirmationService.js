"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBookingConfirmation = void 0;
const buildBookingConfirmation = (payload) => ({
    id: `confirm-${Date.now()}`,
    customerName: payload.customerName,
    service: payload.service,
    stylist: payload.stylist,
    time: payload.time,
    branchId: payload.branchId,
    status: 'confirmed',
    message: 'Your salon appointment has been successfully booked.',
});
exports.buildBookingConfirmation = buildBookingConfirmation;
