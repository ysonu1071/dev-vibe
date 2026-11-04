"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Salon API is running',
        database: database_1.isDatabaseReady ? 'connected' : 'mock-mode',
        environment: process.env.NODE_ENV || 'development',
    });
});
exports.default = router;
