const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.STUDENT));

router.post('/session', chatbotController.createSession);
router.post('/message', chatbotController.sendMessage);
router.get('/history/:sessionId', chatbotController.getHistory);
router.get('/sessions', chatbotController.getSessions);
router.delete('/sessions/:sessionId', chatbotController.deleteSession);

module.exports = router;
