const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const { createNotification } = require('../services/notification.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getQuizzes = catchAsync(async (req, res) => {
  const quizzes = await Quiz.find({ student: req.userId, isCompleted: false })
    .populate('course', 'title subject')
    .sort('-generatedAt');

  res.json({ success: true, data: { quizzes } });
});

const getQuizById = catchAsync(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId)
    .populate('course', 'title subject');

  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (quiz.student.toString() !== req.userId) {
    throw new ApiError(403, 'Not authorized to view this quiz');
  }

  const safeQuiz = quiz.toObject();
  safeQuiz.questions = safeQuiz.questions.map((q) => ({
    questionText: q.questionText,
    options: q.options,
    chapterReference: q.chapterReference,
    _id: q._id,
  }));

  res.json({ success: true, data: { quiz: safeQuiz } });
});

const submitQuiz = catchAsync(async (req, res) => {
  const { quizId, answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    throw new ApiError(400, 'Answers must be an array');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (quiz.student.toString() !== req.userId) {
    throw new ApiError(403, 'Not authorized');
  }
  if (quiz.isCompleted) {
    throw new ApiError(400, 'Quiz already completed');
  }

  let correctCount = 0;
  const weakChapters = [];
  const chapterErrors = {};

  quiz.questions.forEach((q, index) => {
    const userAnswer = answers[index];
    if (userAnswer === q.correctAnswerIndex) {
      correctCount++;
    } else {
      const ref = q.chapterReference || 'general';
      chapterErrors[ref] = (chapterErrors[ref] || 0) + 1;
    }
  });

  for (const [chapter, errors] of Object.entries(chapterErrors)) {
    if (errors > 0) weakChapters.push(chapter);
  }

  const score = Math.round((correctCount / quiz.questions.length) * 100);

  const quizResult = await QuizResult.create({
    quiz: quizId,
    student: req.userId,
    course: quiz.course,
    answers,
    score,
    weakChapters,
    completedAt: new Date(),
  });

  quiz.isCompleted = true;
  await quiz.save();

  const course = await Course.findById(quiz.course).populate('assignedTeachers');
  for (const teacher of course.assignedTeachers) {
    await createNotification({
      userId: teacher._id,
      type: 'quiz_result',
      title: 'Quiz Result Available',
      message: `A student has completed their monthly quiz. Score: ${score}%`,
      link: '/teacher/students',
    });
  }

  await createNotification({
    userId: req.userId,
    type: 'quiz_result',
    title: 'Quiz Completed',
    message: `Your score: ${score}% (${correctCount}/${quiz.questions.length})`,
    link: '/student/results',
  });

  res.json({
    success: true,
    data: {
      quizResult,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      weakChapters,
    },
  });
});

const getResults = catchAsync(async (req, res) => {
  const results = await QuizResult.find({ student: req.userId })
    .populate('course', 'title subject')
    .sort('-createdAt');

  res.json({ success: true, data: { results } });
});

const getStudentsQuizResults = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const teacher = await Teacher.findById(req.userId);
  const isAssigned = teacher.assignedCourses.some((id) => id.toString() === courseId);
  if (!isAssigned) throw new ApiError(403, 'Not authorized for this course');

  const results = await QuizResult.find({ course: courseId })
    .populate('student', 'fullName email avatar level')
    .sort('-createdAt');

  res.json({ success: true, data: { results } });
});

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getResults,
  getStudentsQuizResults,
};
