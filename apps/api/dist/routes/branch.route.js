"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const branchService_1 = require("../services/branchService");
const router = (0, express_1.Router)();
router.get('/branches', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'receptionist', 'super-admin'), (_req, res) => {
    res.json({
        message: 'Branches fetched successfully',
        branches: (0, branchService_1.listBranches)(),
    });
});
router.get('/branches/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'receptionist', 'super-admin'), (req, res) => {
    const branch = (0, branchService_1.getBranchById)(req.params.id);
    if (!branch) {
        return res.status(404).json({
            message: 'Branch not found',
            status: 'error',
        });
    }
    return res.json({
        message: 'Branch fetched successfully',
        branch,
    });
});
router.post('/branches', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'super-admin'), (req, res) => {
    const { name, city, address, salonId } = req.body ?? {};
    if (!name || !city || !address) {
        return res.status(400).json({
            message: 'Branch name, city and address are required',
            status: 'error',
        });
    }
    const branch = (0, branchService_1.createBranch)({
        name: String(name),
        city: String(city),
        address: String(address),
        salonId: salonId ? String(salonId) : undefined,
    });
    return res.status(201).json({
        message: 'Branch created successfully',
        status: 'success',
        branch,
    });
});
router.put('/branches/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'super-admin'), (req, res) => {
    const { name, city, address, status } = req.body ?? {};
    const updated = (0, branchService_1.updateBranch)(req.params.id, {
        name: name !== undefined ? String(name) : undefined,
        city: city !== undefined ? String(city) : undefined,
        address: address !== undefined ? String(address) : undefined,
        status: status !== undefined ? String(status) : undefined,
    });
    if (!updated) {
        return res.status(404).json({
            message: 'Branch not found',
            status: 'error',
        });
    }
    return res.json({
        message: 'Branch updated successfully',
        status: 'success',
        branch: updated,
    });
});
router.delete('/branches/:id', auth_1.authenticate, (0, auth_1.authorizeRoles)('owner', 'manager', 'super-admin'), (req, res) => {
    const deleted = (0, branchService_1.deleteBranch)(req.params.id);
    if (!deleted) {
        return res.status(404).json({
            message: 'Branch not found',
            status: 'error',
        });
    }
    return res.json({
        message: 'Branch deleted successfully',
        status: 'success',
    });
});
exports.default = router;
