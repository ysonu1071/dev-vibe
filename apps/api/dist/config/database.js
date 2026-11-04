"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isDatabaseReady = void 0;
const dns_1 = __importDefault(require("dns"));
const mongoose_1 = __importDefault(require("mongoose"));
// Force public DNS resolution for Atlas SRV records so MongoDB connects reliably
// in environments where the default resolver is blocked or stale.
dns_1.default.setServers(['8.8.8.8', '8.8.4.4']);
dns_1.default.setDefaultResultOrder('ipv4first');
exports.isDatabaseReady = false;
const connectDB = async (failOnError = false) => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        const message = 'MONGODB_URI is not defined in environment variables';
        console.warn(`${message}. Running in mock mode.`);
        if (failOnError) {
            throw new Error(message);
        }
        return false;
    }
    try {
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 15000,
        });
        exports.isDatabaseReady = true;
        console.log('MongoDB connected successfully');
        return true;
    }
    catch (error) {
        exports.isDatabaseReady = false;
        const message = error instanceof Error ? error.message : 'Unknown MongoDB error';
        console.warn(`MongoDB connection failed. Running in mock mode. ${message}`);
        if (failOnError) {
            throw error;
        }
        return false;
    }
};
exports.connectDB = connectDB;
