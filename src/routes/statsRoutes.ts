import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect this route so only admins can access stats
router.get('/', protect, admin, getDashboardStats);

export default router;
