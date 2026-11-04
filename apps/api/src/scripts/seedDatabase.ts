import mongoose from 'mongoose';
import { Branch } from '../models/Branch';
import { Service } from '../models/Service';
import { Salon } from '../models/Salon';
import { User } from '../models/User';
import { Appointment } from '../models/Appointment';

const mongoUri: string = (() => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Set it in the .env file first.');
  }

  return uri;
})();

if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined. Set it in the .env file first.');
}

async function seedDatabase() {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 15000,
  });

  await Promise.all([
    User.deleteMany({}),
    Branch.deleteMany({}),
    Service.deleteMany({}),
    Salon.deleteMany({}),
    Appointment.deleteMany({}),
  ]);

  const ownerId = 'user-1';
  const salonId = 'salon-1';
  const branch1Id = 'branch-1';
  const branch2Id = 'branch-2';

  const owner = await User.create({
    _id: ownerId,
    name: 'Ritika Sharma',
    email: 'admin@glowlane.com',
    passwordHash: 'admin123',
    role: 'owner',
    salonId,
    branchIds: [branch1Id, branch2Id],
  } as any);

  const salon = await Salon.create({
    _id: salonId,
    name: 'GlowLane',
    ownerId,
    website: 'https://glowlane.example',
    phone: '+91-9876543210',
    email: 'hello@glowlane.example',
    status: 'active',
  } as any);

  const branch1 = await Branch.create({
    _id: branch1Id,
    name: 'Bandra Branch',
    salonId,
    city: 'Mumbai',
    address: 'Bandra West, Mumbai',
    status: 'active',
  } as any);

  const branch2 = await Branch.create({
    _id: branch2Id,
    name: 'Powai Branch',
    salonId,
    city: 'Mumbai',
    address: 'Powai, Mumbai',
    status: 'active',
  } as any);

  await User.create([
    {
      _id: 'user-2',
      name: 'Manager A',
      email: 'manager@glowlane.com',
      passwordHash: 'manager123',
      role: 'manager',
      salonId,
      branchIds: [branch1Id],
    } as any,
    {
      _id: 'user-3',
      name: 'Stylist Riya',
      email: 'riya@glowlane.com',
      passwordHash: 'stylist123',
      role: 'stylist',
      salonId,
      branchIds: [branch1Id],
    } as any,
    {
      _id: 'user-4',
      name: 'Reception Desk',
      email: 'reception@glowlane.com',
      passwordHash: 'reception123',
      role: 'receptionist',
      salonId,
      branchIds: [branch2Id],
    } as any,
  ]);

  const services = await Service.insertMany([
    { _id: 'svc-1', name: 'Hair Cut', duration: 45, price: 1200, branchId: branch1Id, status: 'active' } as any,
    { _id: 'svc-2', name: 'Hair Spa', duration: 60, price: 2400, branchId: branch1Id, status: 'active' } as any,
    { _id: 'svc-3', name: 'Facial', duration: 50, price: 1800, branchId: branch2Id, status: 'active' } as any,
    { _id: 'svc-4', name: 'Bridal Makeup', duration: 90, price: 4500, branchId: branch2Id, status: 'active' } as any,
  ]);

  await Appointment.insertMany([
    {
      _id: 'appt-1',
      branchId: branch1Id,
      customerId: ownerId,
      stylistId: 'user-3',
      serviceId: 'svc-2',
      startTime: new Date('2026-11-04T09:30:00'),
      endTime: new Date('2026-11-04T10:30:00'),
      status: 'confirmed',
      paymentStatus: 'paid',
    } as any,
    {
      _id: 'appt-2',
      branchId: branch2Id,
      customerId: ownerId,
      stylistId: 'user-3',
      serviceId: 'svc-4',
      startTime: new Date('2026-11-04T11:00:00'),
      endTime: new Date('2026-11-04T12:30:00'),
      status: 'pending',
      paymentStatus: 'partial',
    } as any,
  ]);

  console.log('Database seeded successfully');
  console.log({ salon: salon.name, branches: [branch1.name, branch2.name], services: services.length });
  await mongoose.disconnect();
}

seedDatabase().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
