import express from 'express';
import { auth, adminAuth } from '../middleware/auth';
import dashboardController from '../controllers/dashboard';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', [auth, adminAuth], dashboardController.getDashboardStats);

// @route   GET /api/dashboard/analytics
// @desc    Get sales analytics
// @access  Private/Admin
router.get('/analytics', [auth, adminAuth], dashboardController.getSalesAnalytics);

export default router;