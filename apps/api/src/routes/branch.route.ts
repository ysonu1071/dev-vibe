import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { createBranch, deleteBranch, getBranchById, listBranches, updateBranch } from '../services/branchService';

const router = Router();

router.get('/branches', authenticate, authorizeRoles('owner', 'manager', 'receptionist', 'super-admin'), (_req, res) => {
  res.json({
    message: 'Branches fetched successfully',
    branches: listBranches(),
  });
});

router.get('/branches/:id', authenticate, authorizeRoles('owner', 'manager', 'receptionist', 'super-admin'), (req, res) => {
  const branchId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const branch = getBranchById(branchId);

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

router.post('/branches', authenticate, authorizeRoles('owner', 'manager', 'super-admin'), (req, res) => {
  const { name, city, address, salonId } = req.body ?? {};

  if (!name || !city || !address) {
    return res.status(400).json({
      message: 'Branch name, city and address are required',
      status: 'error',
    });
  }

  const branch = createBranch({
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

router.put('/branches/:id', authenticate, authorizeRoles('owner', 'manager', 'super-admin'), (req, res) => {
  const branchId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { name, city, address, status } = req.body ?? {};
  const updated = updateBranch(branchId, {
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

router.delete('/branches/:id', authenticate, authorizeRoles('owner', 'manager', 'super-admin'), (req, res) => {
  const branchId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = deleteBranch(branchId);

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

export default router;
