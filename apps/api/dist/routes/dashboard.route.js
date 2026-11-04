"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const dashboardService_1 = require("../services/dashboardService");
const router = (0, express_1.Router)();
router.get('/dashboard', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'super-admin'), (_req, res) => {
    res.json((0, dashboardService_1.buildDashboardData)());
});
exports.default = router;
