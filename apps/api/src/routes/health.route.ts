import { Router } from 'express';
import { isDatabaseReady } from '../config/database';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Salon API is running',
    database: isDatabaseReady ? 'connected' : 'mock-mode',
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
