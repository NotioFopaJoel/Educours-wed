const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const { getIO } = require('../sockets/socket.handler');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createConversation = catchAsync(async (req, res) => {
  const { participantIds } = req.body;
  if (!participantIds || !Array.isArray(participantIds)) {
    throw new ApiError(400, 'participantIds must be an array');
  }

  const participants = [req.userId, ...participantIds];
  const existingConversation = await Conversation.findOne({
    participants: { $all: participants, $size: participants.length },
  });

  if (existingConversation) {
    return res.json({ success: true, data: existingConversation });
  }

  const conversation = await Conversation.create({ participants });
  res.status(201).json({ success: true, data: conversation });
});

const getConversations = catchAsync(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.userId,
  })
    .populate('participants', 'fullName email avatar role')
    .sort('-lastMessageAt');

  res.json({ success: true, data: { conversations } });
});

const getConversation = catchAsync(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId)
    .populate('participants', 'fullName email avatar role');

  if (!conversation) throw new ApiError(404, 'Conversation not found');
  if (!conversation.participants.some((p) => p._id.toString() === req.userId)) {
    throw new ApiError(403, 'Not a participant of this conversation');
  }

  res.json({ success: true, data: conversation });
});

const sendMessage = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  if (!content) throw new ApiError(400, 'Message content is required');

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, 'Conversation not found');
  if (!conversation.participants.some((p) => p.toString() === req.userId)) {
    throw new ApiError(403, 'Not a participant');
  }

  const message = {
    sender: req.userId,
    content,
  };

  conversation.messages.push(message);
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const io = getIO();
  conversation.participants.forEach((participantId) => {
    if (participantId.toString() !== req.userId) {
      io.to(`user:${participantId}`).emit('new-message', {
        conversationId,
        message: { ...message, sender: req.userId },
      });
    }
  });

  const savedMessage = conversation.messages[conversation.messages.length - 1];
  res.status(201).json({ success: true, data: savedMessage });
});

const markConversationRead = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, 'Conversation not found');

  conversation.messages.forEach((msg) => {
    if (msg.sender.toString() !== req.userId && !msg.readAt) {
      msg.readAt = new Date();
    }
  });
  await conversation.save();

  res.json({ success: true, message: 'Messages marked as read' });
});

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  markConversationRead,
};
