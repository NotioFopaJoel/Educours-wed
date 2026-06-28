const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
require('dotenv').config();

const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const adminRoutes = require('./routes/admin.routes');
const courseRoutes = require('./routes/course.routes');
const paymentRoutes = require('./routes/payment.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const quizRoutes = require('./routes/quiz.routes');
const examRoutes = require('./routes/exam.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const liveclassRoutes = require('./routes/liveclass.routes');
const notificationRoutes = require('./routes/notification.routes');
const conversationRoutes = require('./routes/conversation.routes');
const timetableRoutes = require('./routes/timetable.routes');
const supportTicketRoutes = require('./routes/supportTicket.routes');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'EDUCOURS API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/liveclasses', liveclassRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/tickets', supportTicketRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
