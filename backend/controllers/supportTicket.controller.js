const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const { sendTicketUpdateEmail } = require('../services/email.service');
const { createNotification } = require('../services/notification.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { TICKET_STATUS, ROLES } = require('../utils/constants');

const createTicket = catchAsync(async (req, res) => {
  const { subject, category, message } = req.body;
  if (!subject || !category || !message) {
    throw new ApiError(400, 'Subject, category, and message are required');
  }

  const ticket = await SupportTicket.create({
    user: req.userId,
    subject,
    category,
    messages: [{
      sender: req.userId,
      content: message,
      attachmentUrl: req.body.attachmentUrl || '',
    }],
  });

  const admins = await User.find({ role: ROLES.ADMIN });
  for (const admin of admins) {
    await createNotification({
      userId: admin._id,
      type: 'ticket_update',
      title: 'New Support Ticket',
      message: `New ticket: ${subject}`,
      link: '/admin/tickets',
    });
  }

  res.status(201).json({ success: true, data: ticket });
});

const getMyTickets = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = { user: req.userId };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [tickets, total] = await Promise.all([
    SupportTicket.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
    SupportTicket.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: { tickets, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
  });
});

const getTicket = catchAsync(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.ticketId)
    .populate('user', 'fullName email avatar')
    .populate('messages.sender', 'fullName avatar role');

  if (!ticket) throw new ApiError(404, 'Ticket not found');

  if (ticket.user._id.toString() !== req.userId && req.userRole !== ROLES.ADMIN) {
    throw new ApiError(403, 'Not authorized');
  }

  res.json({ success: true, data: ticket });
});

const replyTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params;
  const { content } = req.body;
  if (!content) throw new ApiError(400, 'Message content is required');

  const ticket = await SupportTicket.findById(ticketId).populate('user', 'email language');
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  if (ticket.user._id.toString() !== req.userId && req.userRole !== ROLES.ADMIN) {
    throw new ApiError(403, 'Not authorized');
  }

  const isStaff = req.userRole === ROLES.ADMIN;
  ticket.messages.push({
    sender: req.userId,
    content,
    attachmentUrl: req.body.attachmentUrl || '',
    isStaff,
  });

  if (isStaff && ticket.status === TICKET_STATUS.OPEN) {
    ticket.status = TICKET_STATUS.IN_PROGRESS;
  }

  await ticket.save();

  const recipientId = isStaff ? ticket.user._id : null;
  if (recipientId) {
    await createNotification({
      userId: recipientId,
      type: 'ticket_update',
      title: 'Ticket Response',
      message: `You have a new response on ticket: ${ticket.subject}`,
      link: `/student/tickets/${ticketId}`,
    });

    try {
      await sendTicketUpdateEmail(
        ticket.user.email,
        ticketId,
        ticket.status,
        ticket.user.language || 'en'
      );
    } catch (err) {
      console.error('Ticket email notification failed:', err.message);
    }
  }

  res.json({ success: true, data: ticket });
});

const updateTicketStatus = catchAsync(async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  if (!Object.values(TICKET_STATUS).includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const ticket = await SupportTicket.findById(ticketId).populate('user', 'email language');
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  ticket.status = status;
  if (status === TICKET_STATUS.RESOLVED || status === TICKET_STATUS.CLOSED) {
    ticket.resolvedAt = new Date();
  }
  await ticket.save();

  await createNotification({
    userId: ticket.user._id,
    type: 'ticket_update',
    title: 'Ticket Status Updated',
    message: `Your ticket "${ticket.subject}" is now: ${status}`,
    link: `/student/tickets/${ticketId}`,
  });

  try {
    await sendTicketUpdateEmail(
      ticket.user.email,
      ticketId,
      status,
      ticket.user.language || 'en'
    );
  } catch (err) {
    console.error('Ticket status email failed:', err.message);
  }

  res.json({ success: true, data: ticket });
});

const getAllTickets = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, category } = req.query;
  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [tickets, total] = await Promise.all([
    SupportTicket.find(query)
      .populate('user', 'fullName email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    SupportTicket.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: { tickets, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
  });
});

module.exports = {
  createTicket,
  getMyTickets,
  getTicket,
  replyTicket,
  updateTicketStatus,
  getAllTickets,
};
