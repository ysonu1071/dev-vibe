export const buildBookingConfirmation = (payload: {
  customerName: string;
  service: string;
  stylist: string;
  time: string;
  branchId: string;
}) => ({
  id: `confirm-${Date.now()}`,
  customerName: payload.customerName,
  service: payload.service,
  stylist: payload.stylist,
  time: payload.time,
  branchId: payload.branchId,
  status: 'confirmed',
  message: 'Your salon appointment has been successfully booked.',
});
