import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['super-admin', 'owner', 'manager', 'stylist', 'receptionist', 'customer'],
      default: 'customer',
    },
    branchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon' },
  },
  { timestamps: true }
);

export const User = model('User', userSchema);
