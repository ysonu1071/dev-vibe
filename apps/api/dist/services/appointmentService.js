"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAppointments = exports.createAppointment = void 0;
const seed_1 = require("../utils/seed");
const createAppointment = (input) => {
    const service = seed_1.seedData.services.find((item) => item.id === input.serviceId) ?? seed_1.seedData.services[0];
    return {
        id: `appt-${Date.now()}`,
        customer: input.customerName,
        branchId: input.branchId ?? 'branch-1',
        service: service.name,
        stylist: input.stylist ?? 'Assigned stylist',
        time: input.time,
        status: 'confirmed',
        amount: service.price,
    };
};
exports.createAppointment = createAppointment;
const listAppointments = () => [
    {
        id: 'appt-1',
        customer: 'Aisha M.',
        service: 'Hair Spa',
        stylist: 'Riya',
        time: '09:30 AM',
        status: 'confirmed',
        amount: 2400,
    },
    {
        id: 'appt-2',
        customer: 'Naina K.',
        service: 'Bridal Makeup',
        stylist: 'Sana',
        time: '11:00 AM',
        status: 'in-progress',
        amount: 4500,
    },
];
exports.listAppointments = listAppointments;
