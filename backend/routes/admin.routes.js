const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserDetail);
router.patch('/users/:userId/toggle-status', adminController.toggleUserStatus);
router.patch('/teachers/:teacherId/approve', adminController.approveTeacher);
router.patch('/teachers/:teacherId/suspend', adminController.suspendTeacher);
router.get('/transactions', adminController.getTransactions);
router.post('/broadcast', adminController.broadcastMessage);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
