const { getUnreadCount, markAsRead, markAllAsRead } = require('../services/notification.service');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.userId })
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Notification.countDocuments({ user: req.userId }),
    getUnreadCount(req.userId),
  ]);

  res.json({
    success: true,
    data: {
      notifications,
      total,
      unreadCount,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
});

const readNotification = catchAsync(async (req, res) => {
  const notification = await markAsRead(req.params.notificationId, req.userId);
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.json({ success: true, data: notification });
});

const readAllNotifications = catchAsync(async (req, res) => {
  await markAllAsRead(req.userId);
  res.json({ success: true, message: 'All notifications marked as read' });
});

const getUnread = catchAsync(async (req, res) => {
  const count = await getUnreadCount(req.userId);
  res.json({ success: true, data: { unreadCount: count } });
});

const deleteNotification = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.notificationId,
    user: req.userId,
  });
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.json({ success: true, message: 'Notification deleted' });
});

module.exports = {
  getNotifications,
  readNotification,
  readAllNotifications,
  getUnread,
  deleteNotification,
};
