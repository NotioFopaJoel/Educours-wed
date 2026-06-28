const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');
const SupportTicket = require('../models/SupportTicket');
const { createBulkNotifications } = require('../services/notification.service');
const { sendBroadcastEmail } = require('../services/email.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  ROLES,
  TEACHER_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  TICKET_STATUS,
} = require('../utils/constants');

const getDashboardStats = catchAsync(async (req, res) => {
  const totalStudents = await Student.countDocuments();
  const totalTeachers = await Teacher.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalEnrollments = await Enrollment.countDocuments();

  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyRevenue = await Transaction.aggregate([
    {
      $match: {
        type: TRANSACTION_TYPES.COURSE_PAYMENT,
        status: TRANSACTION_STATUS.SUCCESS,
        createdAt: { $gte: currentMonth },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalRevenue = await Transaction.aggregate([
    {
      $match: {
        type: TRANSACTION_TYPES.COURSE_PAYMENT,
        status: TRANSACTION_STATUS.SUCCESS,
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const pendingTeachers = await Teacher.countDocuments({ status: TEACHER_STATUS.PENDING });
  const openTickets = await SupportTicket.countDocuments({ status: TICKET_STATUS.OPEN });

  const enrollmentsByMonth = await Enrollment.aggregate([
    {
      $group: {
        _id: { year: { $year: '$enrolledAt' }, month: { $month: '$enrolledAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  res.json({
    success: true,
    data: {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingTeachers,
      openTickets,
      enrollmentsByMonth,
    },
  });
});

const getUsers = catchAsync(async (req, res) => {
  const { role, page = 1, limit = 20, search = '', status } = req.query;
  const query = {};

  if (role) query.role = role;
  if (status === 'pending') query.role = ROLES.TEACHER;
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  let users;
  let total;

  if (role === ROLES.TEACHER) {
    const teacherQuery = { ...query };
    delete teacherQuery.role;
    if (status === 'pending') {
      teacherQuery.status = TEACHER_STATUS.PENDING;
    } else if (status === 'approved') {
      teacherQuery.status = TEACHER_STATUS.APPROVED;
    } else if (status === 'suspended') {
      teacherQuery.status = TEACHER_STATUS.SUSPENDED;
    }
    [users, total] = await Promise.all([
      Teacher.find(teacherQuery).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Teacher.countDocuments(teacherQuery),
    ]);
  } else {
    [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      User.countDocuments(query),
    ]);
  }

  res.json({
    success: true,
    data: { users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
  });
});

const getUserDetail = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  let detail = { ...user.toJSON(), id: user._id };

  if (user.role === ROLES.STUDENT) {
    const student = await Student.findById(userId)
      .populate({ path: 'enrollments', populate: { path: 'course', select: 'title subject level price' } });
    detail = { ...detail, ...student?.toJSON() };

    const transactions = await Transaction.find({ fromUser: userId }).sort('-createdAt');
    detail.transactions = transactions;
  } else if (user.role === ROLES.TEACHER) {
    const teacher = await Teacher.findById(userId)
      .populate('assignedCourses', 'title subject level price');
    detail = { ...detail, ...teacher?.toJSON() };
  }

  res.json({ success: true, data: detail });
});

const toggleUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === ROLES.ADMIN) throw new ApiError(403, 'Cannot deactivate admin account');

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: { isActive: user.isActive } });
});

const approveTeacher = catchAsync(async (req, res) => {
  const { teacherId } = req.params;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new ApiError(404, 'Teacher not found');

  teacher.status = TEACHER_STATUS.APPROVED;
  await teacher.save();

  res.json({ success: true, message: 'Teacher approved', data: { status: teacher.status } });
});

const suspendTeacher = catchAsync(async (req, res) => {
  const { teacherId } = req.params;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new ApiError(404, 'Teacher not found');

  teacher.status = TEACHER_STATUS.SUSPENDED;
  await teacher.save();

  res.json({ success: true, message: 'Teacher suspended', data: { status: teacher.status } });
});

const getTransactions = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, type, status } = req.query;
  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('fromUser', 'fullName email')
      .populate('toUser', 'fullName email')
      .populate('course', 'title')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Transaction.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: { transactions, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
  });
});

const broadcastMessage = catchAsync(async (req, res) => {
  const { title, message, targetRole } = req.body;
  if (!title || !message) throw new ApiError(400, 'Title and message are required');

  const query = { isActive: true };
  if (targetRole) query.role = targetRole;

  const users = await User.find(query).select('_id email language');

  const notifications = users.map((u) => ({
    userId: u._id,
    type: 'broadcast',
    title,
    message,
  }));

  await createBulkNotifications(notifications);

  for (const user of users) {
    try {
      await sendBroadcastEmail(user.email, title, message);
    } catch (err) {
      console.error(`Broadcast email failed for ${user.email}:`, err.message);
    }
  }

  res.json({ success: true, message: `Broadcast sent to ${users.length} users` });
});

const getSettings = catchAsync(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json({ success: true, data: settings });
});

const updateSettings = catchAsync(async (req, res) => {
  const allowedFields = [
    'platformName', 'commissionPercent', 'dailyChatbotLimit',
    'teacherPayoutDay', 'contactEmail', 'contactPhone',
    'termsOfService', 'privacyPolicy', 'aboutUs',
    'maintenanceMode', 'logoUrl', 'faviconUrl',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const settings = await Settings.findOneAndUpdate({}, updates, { new: true, upsert: true, runValidators: true });
  res.json({ success: true, data: settings });
});

module.exports = {
  getDashboardStats,
  getUsers,
  getUserDetail,
  toggleUserStatus,
  approveTeacher,
  suspendTeacher,
  getTransactions,
  broadcastMessage,
  getSettings,
  updateSettings,
};
