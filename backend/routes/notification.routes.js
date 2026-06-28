const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.get('/unread', notificationController.getUnread);
router.patch('/:notificationId/read', notificationController.readNotification);
router.patch('/read-all', notificationController.readAllNotifications);
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
