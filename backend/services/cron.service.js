const cron = require('node-cron');
const Enrollment = require('../models/Enrollment');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Teacher = require('../models/Teacher');
const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');
const { generateQuizQuestions } = require('./ai.service');
const { createNotification } = require('./notification.service');
const { calculateRevenueSplit, createPayoutTransaction } = require('./payment.service');
const { ENROLLMENT_STATUS, TRANSACTION_STATUS } = require('../utils/constants');

const startCronJobs = () => {
  cron.schedule('0 0 1 * *', async () => {
    console.log('[Cron] Running monthly quiz generation...');
    try {
      const enrollments = await Enrollment.find({
        status: ENROLLMENT_STATUS.ACTIVE,
        nextQuizDueAt: { $lte: new Date() },
      }).populate('student course');

      for (const enrollment of enrollments) {
        try {
          const course = await Course.findById(enrollment.course);
          const chapters = await Chapter.find({ course: course._id }).populate('lessons');
          const chaptersContent = chapters.map((ch) => {
            const lessonsContent = ch.lessons.map((l) => `${l.title}: ${l.textContent || ''}`).join('\n');
            return `Chapter ${ch.order}: ${ch.title}\n${lessonsContent}`;
          }).join('\n\n');

          const month = new Date().toISOString().slice(0, 7);
          const language = enrollment.student?.language || 'en';

          const quizData = await generateQuizQuestions(
            course.title,
            course.educationSystem,
            course.level,
            chaptersContent.slice(0, 10000),
            language
          );

          const questions = quizData.questions || quizData;
          if (Array.isArray(questions) && questions.length > 0) {
            await Quiz.create({
              course: course._id,
              enrollment: enrollment._id,
              student: enrollment.student._id,
              month,
              questions: questions.slice(0, 15),
            });

            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            enrollment.nextQuizDueAt = nextMonth;
            enrollment.lastQuizGeneratedAt = new Date();
            await enrollment.save();

            await createNotification({
              userId: enrollment.student._id,
              type: 'monthly_quiz',
              title: 'New Monthly Quiz Available',
              message: `Your monthly quiz for ${course.title} is ready. Complete it now!`,
              link: '/student/quizzes',
            });
          }
        } catch (error) {
          console.error(`[Cron] Quiz generation error for enrollment ${enrollment._id}:`, error.message);
        }
      }
      console.log('[Cron] Monthly quiz generation completed');
    } catch (error) {
      console.error('[Cron] Quiz generation cron error:', error.message);
    }
  });

  cron.schedule('0 0 1 * *', async () => {
    console.log('[Cron] Running monthly teacher payout...');
    try {
      const teachers = await Teacher.find({ status: 'approved' });
      const settings = await Settings.findOne();
      const commissionPercent = settings?.commissionPercent || 40;

      for (const teacher of teachers) {
        try {
          const unpaidRevenue = teacher.totalRevenueGenerated - teacher.totalPaidOut;
          if (unpaidRevenue <= 0) continue;

          const { platformShare, teacherShare } = calculateRevenueSplit(unpaidRevenue, commissionPercent);

          await createPayoutTransaction({
            teacherId: teacher._id,
            amount: teacherShare,
            courseId: null,
            description: `Monthly payout - ${new Date().toLocaleDateString()}`,
          });

          teacher.totalPaidOut += teacherShare;
          await teacher.save();

          await createNotification({
            userId: teacher._id,
            type: 'revenue',
            title: 'Monthly Payout Processed',
            message: `Your payout of ${teacherShare} FCFA has been initiated.`,
            link: '/teacher/revenue',
          });
        } catch (error) {
          console.error(`[Cron] Payout error for teacher ${teacher._id}:`, error.message);
        }
      }
      console.log('[Cron] Teacher payout completed');
    } catch (error) {
      console.error('[Cron] Payout cron error:', error.message);
    }
  });

  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Checking enrollment quiz due dates...');
    try {
      const enrollments = await Enrollment.find({
        status: ENROLLMENT_STATUS.ACTIVE,
        nextQuizDueAt: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      }).populate('student');

      for (const enrollment of enrollments) {
        await createNotification({
          userId: enrollment.student._id,
          type: 'monthly_quiz',
          title: 'Quiz Coming Soon',
          message: 'Your monthly quiz is due in 3 days. Be prepared!',
          link: '/student/quizzes',
        });
      }
    } catch (error) {
      console.error('[Cron] Quiz reminder error:', error.message);
    }
  });

  console.log('[Cron] All scheduled jobs started');
};

module.exports = { startCronJobs };
