const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.post('/', conversationController.createConversation);
router.get('/', conversationController.getConversations);
router.get('/:conversationId', conversationController.getConversation);
router.post('/:conversationId/messages', conversationController.sendMessage);
router.patch('/:conversationId/read', conversationController.markConversationRead);

module.exports = router;
