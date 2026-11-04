import { Schema, model } from 'mongoose';

const serviceSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    branchId: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Service = model('Service', serviceSchema);
