const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Teacher = require('../models/Teacher');
const { createBulkNotifications } = require('../services/notification.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createLiveClass = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const teacher = await Teacher.findById(req.userId);
  const isAssigned = teacher.assignedCourses.some((id) => id.toString() === courseId);
  if (!isAssigned) throw new ApiError(403, 'Not authorized for this course');

  const liveClass = await LiveClass.create({
    ...req.body,
    course: courseId,
    teacher: req.userId,
  });

  const course = await Course.findById(courseId);
  const enrollments = await Enrollment.find({ course: courseId });
  const notifications = enrollments.map((e) => ({
    userId: e.student,
    type: 'live_class',
    title: 'New Live Class Scheduled',
    message: `A live class "${liveClass.title}" has been scheduled for ${new Date(liveClass.startDate).toLocaleString()}`,
    link: '/student/timetable',
  }));

  if (notifications.length > 0) {
    await createBulkNotifications(notifications);
  }

  res.status(201).json({ success: true, data: liveClass });
});

const updateLiveClass = catchAsync(async (req, res) => {
  const liveClass = await LiveClass.findOneAndUpdate(
    { _id: req.params.liveClassId, teacher: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!liveClass) throw new ApiError(404, 'Live class not found or not authorized');
  res.json({ success: true, data: liveClass });
});

const deleteLiveClass = catchAsync(async (req, res) => {
  const liveClass = await LiveClass.findOneAndDelete({
    _id: req.params.liveClassId,
    teacher: req.userId,
  });
  if (!liveClass) throw new ApiError(404, 'Live class not found or not authorized');
  res.json({ success: true, message: 'Live class deleted' });
});

const getLiveClasses = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const liveClasses = await LiveClass.find(courseId ? { course: courseId } : {})
    .populate('teacher', 'fullName')
    .populate('course', 'title subject level')
    .sort('startDate');

  res.json({ success: true, data: { liveClasses } });
});

const getLiveClass = catchAsync(async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.liveClassId)
    .populate('teacher', 'fullName avatar')
    .populate('course', 'title subject');
  if (!liveClass) throw new ApiError(404, 'Live class not found');
  res.json({ success: true, data: liveClass });
});

const startLiveClass = catchAsync(async (req, res) => {
  const liveClass = await LiveClass.findOneAndUpdate(
    { _id: req.params.liveClassId, teacher: req.userId },
    { status: 'live' },
    { new: true }
  );
  if (!liveClass) throw new ApiError(404, 'Live class not found or not authorized');

  const course = await Course.findById(liveClass.course);
  const enrollments = await Enrollment.find({ course: liveClass.course });
  const notifications = enrollments.map((e) => ({
    userId: e.student,
    type: 'live_class',
    title: 'Live Class Started!',
    message: `"${liveClass.title}" is now live. Join now!`,
    link: `/student/courses/${liveClass.course}`,
  }));

  if (notifications.length > 0) {
    await createBulkNotifications(notifications);
  }

  res.json({ success: true, data: liveClass });
});

const endLiveClass = catchAsync(async (req, res) => {
  const liveClass = await LiveClass.findOneAndUpdate(
    { _id: req.params.liveClassId, teacher: req.userId },
    { status: 'completed' },
    { new: true }
  );
  if (!liveClass) throw new ApiError(404, 'Live class not found or not authorized');
  res.json({ success: true, data: liveClass });
});

module.exports = {
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  getLiveClasses,
  getLiveClass,
  startLiveClass,
  endLiveClass,
};
