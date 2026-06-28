const ChatMessage = require('../models/ChatMessage');
const Student = require('../models/Student');
const Settings = require('../models/Settings');
const { generateChatResponse } = require('../services/ai.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createSession = catchAsync(async (req, res) => {
  const sessionId = `session_${req.userId}_${Date.now()}`;
  res.json({ success: true, data: { sessionId } });
});

const sendMessage = catchAsync(async (req, res) => {
  const { message, sessionId, courseId } = req.body;
  if (!message || !sessionId) {
    throw new ApiError(400, 'Message and sessionId are required');
  }

  const settings = await Settings.findOne();
  const dailyLimit = settings?.dailyChatbotLimit || 50;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMessages = await ChatMessage.countDocuments({
    student: req.userId,
    role: 'user',
    createdAt: { $gte: today },
  });

  if (todayMessages >= dailyLimit) {
    throw new ApiError(429, 'Daily message limit reached. Please try again tomorrow.');
  }

  const student = await Student.findById(req.userId);
  if (!student) throw new ApiError(404, 'Student not found');

  await ChatMessage.create({
    student: req.userId,
    course: courseId || null,
    role: 'user',
    content: message,
    sessionId,
  });

  const recentHistory = await ChatMessage.find({ student: req.userId, sessionId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const conversationHistory = recentHistory.reverse().map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const aiResponse = await generateChatResponse(
    conversationHistory,
    student.level,
    student.language || 'en'
  );

  await ChatMessage.create({
    student: req.userId,
    course: courseId || null,
    role: 'assistant',
    content: aiResponse,
    sessionId,
  });

  res.json({
    success: true,
    data: {
      message: aiResponse,
      sessionId,
    },
  });
});

const getHistory = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  const query = { student: req.userId };
  if (sessionId && sessionId !== 'all') query.sessionId = sessionId;

  const messages = await ChatMessage.find(query)
    .sort({ createdAt: 1 })
    .limit(100);

  res.json({ success: true, data: { messages, sessionId } });
});

const getSessions = catchAsync(async (req, res) => {
  const sessions = await ChatMessage.distinct('sessionId', { student: req.userId });
  const sessionsData = [];

  for (const sessionId of sessions) {
    const lastMessage = await ChatMessage.findOne({ student: req.userId, sessionId })
      .sort({ createdAt: -1 })
      .select('createdAt');
    sessionsData.push({
      sessionId,
      lastActivity: lastMessage?.createdAt || null,
    });
  }

  sessionsData.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));

  res.json({ success: true, data: { sessions: sessionsData } });
});

const deleteSession = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  await ChatMessage.deleteMany({ student: req.userId, sessionId });
  res.json({ success: true, message: 'Chat session deleted' });
});

module.exports = {
  createSession,
  sendMessage,
  getHistory,
  getSessions,
  deleteSession,
};
