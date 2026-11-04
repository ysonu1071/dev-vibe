import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { buildDashboardData } from '../services/dashboardService';

const router = Router();

router.get('/dashboard', authenticate, authorizeRoles('owner', 'manager', 'super-admin'), (_req, res) => {
  res.json(buildDashboardData());
});

export default router;
