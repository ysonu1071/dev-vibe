"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salon = void 0;
const mongoose_1 = require("mongoose");
const salonSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    website: { type: String },
    phone: { type: String },
    email: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });
exports.Salon = (0, mongoose_1.model)('Salon', salonSchema);
