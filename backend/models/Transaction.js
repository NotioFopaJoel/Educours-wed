const mongoose = require('mongoose');
const { TRANSACTION_TYPES, TRANSACTION_STATUS, PAYMENT_PROVIDERS } = require('../utils/constants');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPES),
    required: [true, 'Transaction type is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  paymentProvider: {
    type: String,
    enum: Object.values(PAYMENT_PROVIDERS),
  },
  providerTransactionId: {
    type: String,
  },
  providerReference: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(TRANSACTION_STATUS),
    default: TRANSACTION_STATUS.PENDING,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

transactionSchema.index({ fromUser: 1, createdAt: -1 });
transactionSchema.index({ toUser: 1, createdAt: -1 });
transactionSchema.index({ providerTransactionId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
