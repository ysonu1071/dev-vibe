import { Schema, model } from 'mongoose';

const branchSchema = new Schema(
  {
    name: { type: String, required: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String },
    openingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '21:00' },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Branch = model('Branch', branchSchema);
