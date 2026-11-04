import { Schema, model } from 'mongoose';

const salonSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    website: { type: String },
    phone: { type: String },
    email: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Salon = model('Salon', salonSchema);
