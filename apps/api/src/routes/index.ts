import { Router } from 'express';
import healthRoute from './health.route';
import authRoute from './auth.route';
import branchRoute from './branch.route';
import appointmentRoute from './appointment.route';
import dashboardRoute from './dashboard.route';
import serviceRoute from './service.route';

const router = Router();

router.use(healthRoute);
router.use(authRoute);
router.use(branchRoute);
router.use(appointmentRoute);
router.use(dashboardRoute);
router.use(serviceRoute);

export default router;
