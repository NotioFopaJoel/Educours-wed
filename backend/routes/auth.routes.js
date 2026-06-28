const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register/student', authController.registerStudent);
router.post('/register/teacher', authController.registerTeacher);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshTokenHandler);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/password', authenticate, authController.updatePassword);
router.put('/complete-onboarding', authenticate, authController.completeOnboarding);

module.exports = router;
