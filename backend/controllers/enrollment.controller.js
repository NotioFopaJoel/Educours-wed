const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const enrollStudent = catchAsync(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.isPublished) throw new ApiError(400, 'Course is not published');

  const existingEnrollment = await Enrollment.findOne({ student: req.userId, course: courseId });
  if (existingEnrollment) {
    throw new ApiError(409, 'Already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    student: req.userId,
    course: courseId,
    nextQuizDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  course.studentsEnrolledCount += 1;
  await course.save();

  await Student.findByIdAndUpdate(req.userId, { $push: { enrollments: enrollment._id } });

  res.status(201).json({ success: true, data: enrollment });
});

const getEnrollmentsByCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const enrollments = await Enrollment.find({ course: courseId })
    .populate('student', 'fullName email avatar level educationSystem')
    .sort('-enrolledAt');

  res.json({ success: true, data: { enrollments } });
});

module.exports = { enrollStudent, getEnrollmentsByCourse };
