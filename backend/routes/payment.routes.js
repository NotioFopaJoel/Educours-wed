const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.post('/initiate', authenticate, authorize(ROLES.STUDENT), paymentController.initiatePayment);
router.post('/mesomb-webhook', paymentController.handleMeSombWebhook);
router.get('/verify/:transactionId', authenticate, paymentController.verifyPayment);

module.exports = router;
