const Notification = require('../models/Notification');
const { getIO } = require('../sockets/socket.handler');

const createNotification = async ({ userId, type, title, message, link = '' }) => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    link,
  });

  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }

  return notification;
};

const createBulkNotifications = async (notifications) => {
  const created = await Notification.insertMany(
    notifications.map((n) => ({
      user: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link || '',
    }))
  );

  const io = getIO();
  if (io) {
    notifications.forEach((n) => {
      io.to(`user:${n.userId}`).emit('notification', {
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link || '',
      });
    });
  }

  return created;
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, isRead: false });
};

module.exports = {
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
