import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stylistId: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: Schema.Types.ObjectId, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Appointment = model('Appointment', appointmentSchema);
