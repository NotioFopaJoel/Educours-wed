const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const Transaction = require('../models/Transaction');
const { ENROLLMENT_STATUS, TRANSACTION_STATUS } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getDashboard = catchAsync(async (req, res) => {
  const student = await Student.findById(req.userId);

  const enrollments = await Enrollment.find({ student: req.userId })
    .populate('course', 'title subject level coverImage slug')
    .sort('-enrolledAt');

  const activeCourses = enrollments.filter((e) => e.status === ENROLLMENT_STATUS.ACTIVE);
  const completedCourses = enrollments.filter((e) => e.status === ENROLLMENT_STATUS.COMPLETED);
  const totalProgress = activeCourses.reduce((sum, e) => sum + e.progress, 0);
  const averageProgress = activeCourses.length > 0 ? Math.round(totalProgress / activeCourses.length) : 0;

  const recentQuizResults = await QuizResult.find({ student: req.userId })
    .populate('course', 'title')
    .sort('-createdAt')
    .limit(5);

  const recentTransactions = await Transaction.find({ fromUser: req.userId })
    .populate('course', 'title')
    .sort('-createdAt')
    .limit(5);

  res.json({
    success: true,
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        educationSystem: student.educationSystem,
        level: student.level,
        avatar: student.avatar,
      },
      stats: {
        totalEnrolled: enrollments.length,
        activeCourses: activeCourses.length,
        completedCourses: completedCourses.length,
        averageProgress,
      },
      recentEnrollments: enrollments.slice(0, 5),
      recentQuizResults,
      recentTransactions,
    },
  });
});

const getEnrollments = catchAsync(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.userId })
    .populate('course', 'title subject level coverImage slug price educationSystem')
    .sort('-enrolledAt');

  res.json({ success: true, data: { enrollments } });
});

const getEnrollmentDetail = catchAsync(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    _id: req.params.enrollmentId,
    student: req.userId,
  }).populate({
    path: 'course',
    populate: {
      path: 'chapters',
      populate: { path: 'lessons', options: { sort: { order: 1 } } },
      options: { sort: { order: 1 } },
    },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  res.json({ success: true, data: { enrollment } });
});

const updateLessonProgress = catchAsync(async (req, res) => {
  const { lessonId } = req.body;
  const enrollment = await Enrollment.findOne({
    _id: req.params.enrollmentId,
    student: req.userId,
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const course = await Course.findById(enrollment.course).populate({
    path: 'chapters',
    populate: { path: 'lessons' },
  });

  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

  if (enrollment.progress >= 100) {
    enrollment.status = ENROLLMENT_STATUS.COMPLETED;
  }

  await enrollment.save();

  res.json({ success: true, data: { enrollment } });
});

const getQuizResults = catchAsync(async (req, res) => {
  const results = await QuizResult.find({ student: req.userId })
    .populate('course', 'title subject level')
    .sort('-createdAt');

  res.json({ success: true, data: { results } });
});

const getTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.find({ fromUser: req.userId })
    .populate('course', 'title')
    .sort('-createdAt');

  res.json({ success: true, data: { transactions } });
});

module.exports = {
  getDashboard,
  getEnrollments,
  getEnrollmentDetail,
  updateLessonProgress,
  getQuizResults,
  getTransactions,
};
