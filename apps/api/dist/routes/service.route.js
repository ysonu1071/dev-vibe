"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const serviceService_1 = require("../services/serviceService");
const router = (0, express_1.Router)();
router.get('/services', async (_req, res) => {
    res.json({
        message: 'Service catalog fetched successfully',
        services: (0, serviceService_1.listServices)(),
    });
});
router.get('/services/:id', async (req, res) => {
    const service = (0, serviceService_1.getServiceById)(req.params.id);
    if (!service) {
        return res.status(404).json({
            message: 'Service not found',
            status: 'error',
        });
    }
    return res.json({
        message: 'Service fetched successfully',
        service,
    });
});
router.post('/services', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'super-admin'), (req, res) => {
    const { name, duration, price } = req.body ?? {};
    if (!name || duration === undefined || price === undefined) {
        return res.status(400).json({
            message: 'name, duration and price are required',
            status: 'error',
        });
    }
    const service = (0, serviceService_1.createService)({
        name: String(name),
        duration: Number(duration),
        price: Number(price),
    });
    return res.status(201).json({
        message: 'Service created successfully',
        status: 'success',
        service,
    });
});
router.put('/services/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'super-admin'), (req, res) => {
    const { name, duration, price } = req.body ?? {};
    const updated = (0, serviceService_1.updateService)(req.params.id, {
        name: name !== undefined ? String(name) : undefined,
        duration: duration !== undefined ? Number(duration) : undefined,
        price: price !== undefined ? Number(price) : undefined,
    });
    if (!updated) {
        return res.status(404).json({
            message: 'Service not found',
            status: 'error',
        });
    }
    return res.json({
        message: 'Service updated successfully',
        status: 'success',
        service: updated,
    });
});
router.delete('/services/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'super-admin'), (req, res) => {
    const deleted = (0, serviceService_1.deleteService)(req.params.id);
    if (!deleted) {
        return res.status(404).json({
            message: 'Service not found',
            status: 'error',
        });
    }
    return res.json({
        message: 'Service deleted successfully',
        status: 'success',
    });
});
exports.default = router;
