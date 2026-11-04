"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDashboardData = void 0;
const seed_1 = require("../utils/seed");
const buildDashboardData = () => ({
    stats: [
        { label: 'Today Revenue', value: '₹48,750', trend: '+12.4%' },
        { label: 'Appointments', value: '184', trend: '+8.1%' },
        { label: 'Active Staff', value: '23', trend: '+3' },
        { label: 'Loyalty Members', value: '1,420', trend: '+17.6%' },
    ],
    branches: seed_1.seedData.branches,
    services: seed_1.seedData.services,
    appointments: [
        { time: '09:30 AM', client: 'Aisha M.', service: 'Hair Spa', stylist: 'Riya', status: 'Confirmed' },
        { time: '11:00 AM', client: 'Naina K.', service: 'Bridal Makeup', stylist: 'Sana', status: 'In Progress' },
        { time: '01:15 PM', client: 'Meera P.', service: 'Facial + Cleanup', stylist: 'Anjali', status: 'Pending' },
    ],
});
exports.buildDashboardData = buildDashboardData;
