"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
const mongoose_1 = require("mongoose");
const branchSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    salonId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Salon', required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String },
    openingHours: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '21:00' },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });
exports.Branch = (0, mongoose_1.model)('Branch', branchSchema);
