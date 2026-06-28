const Exam = require('../models/Exam');
const ExamSubmission = require('../models/ExamSubmission');
const Teacher = require('../models/Teacher');
const { createNotification } = require('../services/notification.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createExam = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const teacher = await Teacher.findById(req.userId);
  const isAssigned = teacher.assignedCourses.some((id) => id.toString() === courseId);
  if (!isAssigned) throw new ApiError(403, 'Not authorized for this course');

  const exam = await Exam.create({
    ...req.body,
    course: courseId,
    createdBy: req.userId,
  });

  res.status(201).json({ success: true, data: exam });
});

const updateExam = catchAsync(async (req, res) => {
  const exam = await Exam.findOneAndUpdate(
    { _id: req.params.examId, createdBy: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!exam) throw new ApiError(404, 'Exam not found or not authorized');
  res.json({ success: true, data: exam });
});

const deleteExam = catchAsync(async (req, res) => {
  const exam = await Exam.findOneAndDelete({ _id: req.params.examId, createdBy: req.userId });
  if (!exam) throw new ApiError(404, 'Exam not found or not authorized');
  res.json({ success: true, message: 'Exam deleted' });
});

const getExam = catchAsync(async (req, res) => {
  const exam = await Exam.findById(req.params.examId).populate('course', 'title subject level');
  if (!exam) throw new ApiError(404, 'Exam not found');
  res.json({ success: true, data: exam });
});

const getExamsByCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const exams = await Exam.find({ course: courseId }).sort('-createdAt');
  res.json({ success: true, data: { exams } });
});

const submitExam = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const { answers } = req.body;

  const exam = await Exam.findById(examId);
  if (!exam) throw new ApiError(404, 'Exam not found');

  const existing = await ExamSubmission.findOne({ exam: examId, student: req.userId });
  if (existing) throw new ApiError(400, 'Exam already submitted');

  const submission = await ExamSubmission.create({
    exam: examId,
    student: req.userId,
    course: exam.course,
    answers: answers.map((a, i) => ({
      questionIndex: i,
      answer: a,
    })),
    totalPoints: exam.totalPoints,
  });

  res.status(201).json({ success: true, data: submission });
});

const gradeExam = catchAsync(async (req, res) => {
  const { submissionId } = req.params;
  const { scores, feedback } = req.body;

  const submission = await ExamSubmission.findById(submissionId).populate('exam');
  if (!submission) throw new ApiError(404, 'Submission not found');

  let totalScore = 0;
  submission.answers = submission.answers.map((a, i) => ({
    ...a.toObject(),
    score: scores?.[i] || 0,
    feedback: feedback?.[i] || '',
  }));
  totalScore = (scores || []).reduce((sum, s) => sum + (s || 0), 0);

  submission.totalScore = totalScore;
  submission.isGraded = true;
  submission.gradedAt = new Date();
  submission.gradedBy = req.userId;
  await submission.save();

  await createNotification({
    userId: submission.student,
    type: 'exam_result',
    title: 'Exam Graded',
    message: `Your exam has been graded. Score: ${totalScore}/${submission.totalPoints}`,
    link: '/student/results',
  });

  res.json({ success: true, data: submission });
});

const getSubmissions = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const submissions = await ExamSubmission.find({ exam: examId })
    .populate('student', 'fullName email avatar')
    .sort('-submittedAt');

  res.json({ success: true, data: { submissions } });
});

module.exports = {
  createExam,
  updateExam,
  deleteExam,
  getExam,
  getExamsByCourse,
  submitExam,
  gradeExam,
  getSubmissions,
};
