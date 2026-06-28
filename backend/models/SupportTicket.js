const mongoose = require('mongoose');
const { TICKET_CATEGORIES, TICKET_STATUS } = require('../utils/constants');

const ticketMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
  },
  attachmentUrl: {
    type: String,
    default: '',
  },
  isStaff: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: 200,
  },
  category: {
    type: String,
    enum: Object.values(TICKET_CATEGORIES),
    required: [true, 'Category is required'],
  },
  status: {
    type: String,
    enum: Object.values(TICKET_STATUS),
    default: TICKET_STATUS.OPEN,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  messages: [ticketMessageSchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

supportTicketSchema.index({ user: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ category: 1 });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
