"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const appointmentSchema = new mongoose_1.Schema({
    branchId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch', required: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    stylistId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });
exports.Appointment = (0, mongoose_1.model)('Appointment', appointmentSchema);
