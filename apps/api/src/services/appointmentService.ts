import type { Appointment } from '../models/Appointment';
import { seedData } from '../utils/seed';

export type AppointmentStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid';

export type AppointmentInput = {
  customerName: string;
  serviceId: string;
  stylist?: string;
  time: string;
  branchId?: string;
  paymentStatus?: PaymentStatus;
};

const normalizeStatus = (status: string): AppointmentStatus => {
  const next = String(status ?? 'pending').trim().toLowerCase();

  if (next === 'in progress') return 'in-progress';
  if (next === 'in-progress') return 'in-progress';
  if (next === 'completed') return 'completed';
  if (next === 'cancelled') return 'cancelled';
  if (next === 'confirmed') return 'confirmed';

  return 'pending';
};

const normalizePaymentStatus = (status: string): PaymentStatus => {
  const next = String(status ?? 'pending').trim().toLowerCase();

  if (next === 'paid') return 'paid';
  if (next === 'partial') return 'partial';

  return 'pending';
};

const appointmentStore = [
  {
    id: 'appt-1',
    customer: 'Aisha M.',
    service: 'Hair Spa',
    stylist: 'Riya',
    time: '09:30 AM',
    status: 'confirmed' as AppointmentStatus,
    paymentStatus: 'paid' as PaymentStatus,
    amount: 2400,
  },
  {
    id: 'appt-2',
    customer: 'Naina K.',
    service: 'Bridal Makeup',
    stylist: 'Sana',
    time: '11:00 AM',
    status: 'in-progress' as AppointmentStatus,
    paymentStatus: 'partial' as PaymentStatus,
    amount: 4500,
  },
  {
    id: 'appt-3',
    customer: 'Meera P.',
    service: 'Facial + Cleanup',
    stylist: 'Anjali',
    time: '01:15 PM',
    status: 'pending' as AppointmentStatus,
    paymentStatus: 'pending' as PaymentStatus,
    amount: 3200,
  },
];

export const createAppointment = (input: AppointmentInput) => {
  const service = seedData.services.find((item) => item.id === input.serviceId) ?? seedData.services[0];

  return {
    id: `appt-${Date.now()}`,
    customer: input.customerName,
    branchId: input.branchId ?? 'branch-1',
    service: service.name,
    stylist: input.stylist ?? 'Assigned stylist',
    time: input.time,
    status: 'confirmed' as AppointmentStatus,
    paymentStatus: normalizePaymentStatus(input.paymentStatus ?? 'pending'),
    amount: service.price,
  };
};

export const listAppointments = () => appointmentStore;

export const updateAppointmentStatus = (id: string, status: string) => {
  const normalized = normalizeStatus(status);
  const record = appointmentStore.find((item) => item.id === id);

  if (!record) {
    return null;
  }

  record.status = normalized;
  return record;
};

export const updateAppointmentPaymentStatus = (id: string, paymentStatus: string) => {
  const normalized = normalizePaymentStatus(paymentStatus);
  const record = appointmentStore.find((item) => item.id === id);

  if (!record) {
    return null;
  }

  record.paymentStatus = normalized;
  return record;
};
