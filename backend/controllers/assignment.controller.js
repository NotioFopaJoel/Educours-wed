const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Teacher = require('../models/Teacher');
const { createNotification } = require('../services/notification.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createAssignment = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const teacher = await Teacher.findById(req.userId);
  const isAssigned = teacher.assignedCourses.some((id) => id.toString() === courseId);
  if (!isAssigned) throw new ApiError(403, 'Not authorized');

  const assignment = await Assignment.create({
    ...req.body,
    course: courseId,
    createdBy: req.userId,
  });

  res.status(201).json({ success: true, data: assignment });
});

const updateAssignment = catchAsync(async (req, res) => {
  const assignment = await Assignment.findOneAndUpdate(
    { _id: req.params.assignmentId, createdBy: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!assignment) throw new ApiError(404, 'Assignment not found or not authorized');
  res.json({ success: true, data: assignment });
});

const deleteAssignment = catchAsync(async (req, res) => {
  const assignment = await Assignment.findOneAndDelete({
    _id: req.params.assignmentId,
    createdBy: req.userId,
  });
  if (!assignment) throw new ApiError(404, 'Assignment not found or not authorized');
  res.json({ success: true, message: 'Assignment deleted' });
});

const getAssignments = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const assignments = await Assignment.find({ course: courseId }).sort('-createdAt');
  res.json({ success: true, data: { assignments } });
});

const getAssignment = catchAsync(async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId)
    .populate('course', 'title subject');
  if (!assignment) throw new ApiError(404, 'Assignment not found');
  res.json({ success: true, data: assignment });
});

const submitAssignment = catchAsync(async (req, res) => {
  const { assignmentId } = req.params;
  const { content } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new ApiError(404, 'Assignment not found');

  const existing = await AssignmentSubmission.findOne({
    assignment: assignmentId,
    student: req.userId,
  });
  if (existing) throw new ApiError(400, 'Already submitted');

  const submission = await AssignmentSubmission.create({
    assignment: assignmentId,
    student: req.userId,
    course: assignment.course,
    content: content || '',
    fileUrl: req.body.fileUrl || '',
    maxScore: assignment.totalPoints,
  });

  res.status(201).json({ success: true, data: submission });
});

const gradeAssignment = catchAsync(async (req, res) => {
  const { submissionId } = req.params;
  const { score, feedback } = req.body;

  const submission = await AssignmentSubmission.findById(submissionId)
    .populate({ path: 'assignment', select: 'totalPoints' });
  if (!submission) throw new ApiError(404, 'Submission not found');

  if (score > submission.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${submission.maxScore}`);
  }

  submission.score = score;
  submission.feedback = feedback || '';
  submission.isGraded = true;
  submission.gradedBy = req.userId;
  submission.gradedAt = new Date();
  await submission.save();

  await createNotification({
    userId: submission.student,
    type: 'assignment',
    title: 'Assignment Graded',
    message: `Your assignment has been graded. Score: ${score}/${submission.maxScore}`,
    link: '/student/courses',
  });

  res.json({ success: true, data: submission });
});

const getSubmissions = catchAsync(async (req, res) => {
  const { assignmentId } = req.params;
  const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
    .populate('student', 'fullName email avatar')
    .sort('-submittedAt');

  res.json({ success: true, data: { submissions } });
});

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignments,
  getAssignment,
  submitAssignment,
  gradeAssignment,
  getSubmissions,
};
