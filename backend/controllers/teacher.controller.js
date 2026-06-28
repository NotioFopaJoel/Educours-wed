const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const QuizResult = require('../models/QuizResult');
const Transaction = require('../models/Transaction');
const LiveClass = require('../models/LiveClass');
const { ENROLLMENT_STATUS, TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getDashboard = catchAsync(async (req, res) => {
  const teacher = await Teacher.findById(req.userId).populate('assignedCourses');

  const courseIds = teacher.assignedCourses.map((c) => c._id);

  const totalStudents = await Enrollment.countDocuments({
    course: { $in: courseIds },
    status: ENROLLMENT_STATUS.ACTIVE,
  });

  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyRevenue = await Transaction.aggregate([
    {
      $match: {
        toUser: teacher._id,
        type: TRANSACTION_TYPES.TEACHER_PAYOUT,
        status: TRANSACTION_STATUS.SUCCESS,
        createdAt: { $gte: currentMonth },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const upcomingLiveClasses = await LiveClass.find({
    teacher: req.userId,
    startDate: { $gte: new Date() },
    status: 'scheduled',
  }).sort('startDate').limit(5);

  res.json({
    success: true,
    data: {
      teacher: {
        id: teacher._id,
        fullName: teacher.fullName,
        university: teacher.university,
        status: teacher.status,
        subjectsCanTeach: teacher.subjectsCanTeach,
        totalRevenueGenerated: teacher.totalRevenueGenerated,
        totalPaidOut: teacher.totalPaidOut,
      },
      stats: {
        assignedCourses: teacher.assignedCourses.length,
        totalStudents,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingBalance: teacher.totalRevenueGenerated - teacher.totalPaidOut,
      },
      assignedCourses: teacher.assignedCourses,
      upcomingLiveClasses,
    },
  });
});

const getAssignedCourses = catchAsync(async (req, res) => {
  const teacher = await Teacher.findById(req.userId)
    .populate({
      path: 'assignedCourses',
      populate: {
        path: 'chapters',
        populate: { path: 'lessons', options: { sort: { order: 1 } } },
        options: { sort: { order: 1 } },
      },
    });

  res.json({ success: true, data: { courses: teacher.assignedCourses } });
});

const getStudents = catchAsync(async (req, res) => {
  const teacher = await Teacher.findById(req.userId);
  const courseIds = teacher.assignedCourses.map((c) => c._id);

  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate('student', 'fullName email avatar level educationSystem')
    .populate('course', 'title subject level');

  const quizResults = await QuizResult.find({
    course: { $in: courseIds },
  }).populate('student', 'fullName email').sort('-createdAt');

  res.json({ success: true, data: { students: enrollments, quizResults } });
});

const getRevenue = catchAsync(async (req, res) => {
  const teacher = await Teacher.findById(req.userId);

  const payouts = await Transaction.find({
    toUser: req.userId,
    type: TRANSACTION_TYPES.TEACHER_PAYOUT,
  }).sort('-createdAt');

  const monthlyData = await Transaction.aggregate([
    {
      $match: {
        toUser: teacher._id,
        type: TRANSACTION_TYPES.TEACHER_PAYOUT,
      },
    },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  res.json({
    success: true,
    data: {
      totalRevenueGenerated: teacher.totalRevenueGenerated,
      totalPaidOut: teacher.totalPaidOut,
      pendingBalance: teacher.totalRevenueGenerated - teacher.totalPaidOut,
      paymentMethod: teacher.paymentMethod,
      payouts,
      monthlyData,
    },
  });
});

module.exports = {
  getDashboard,
  getAssignedCourses,
  getStudents,
  getRevenue,
};
