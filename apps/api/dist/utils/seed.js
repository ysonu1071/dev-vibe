"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
exports.seedData = {
    salons: [
        {
            id: 'salon-1',
            name: 'GlowLane Bandra',
            city: 'Mumbai',
            status: 'active',
        },
        {
            id: 'salon-2',
            name: 'GlowLane Powai',
            city: 'Mumbai',
            status: 'active',
        },
    ],
    branches: [
        {
            id: 'branch-1',
            salonId: 'salon-1',
            name: 'Bandra Branch',
            city: 'Mumbai',
            address: 'Bandra West, Mumbai',
            status: 'active',
        },
        {
            id: 'branch-2',
            salonId: 'salon-2',
            name: 'Powai Branch',
            city: 'Mumbai',
            address: 'Powai, Mumbai',
            status: 'active',
        },
    ],
    services: [
        { id: 'svc-1', name: 'Hair Cut', duration: 45, price: 1200 },
        { id: 'svc-2', name: 'Hair Spa', duration: 60, price: 2400 },
        { id: 'svc-3', name: 'Facial', duration: 50, price: 1800 },
        { id: 'svc-4', name: 'Bridal Makeup', duration: 90, price: 4500 },
    ],
};
