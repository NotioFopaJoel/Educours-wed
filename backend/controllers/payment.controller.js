const Transaction = require('../models/Transaction');
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { initiateMeSombPayment } = require('../services/payment.service');
const { createNotification } = require('../services/notification.service');
const { PAYMENT_PROVIDERS, TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../utils/constants');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const initiatePayment = catchAsync(async (req, res) => {
  const { courseId, phoneNumber, service } = req.body;
  if (!courseId) throw new ApiError(400, 'Course ID is required');
  if (!phoneNumber) throw new ApiError(400, 'Phone number is required');
  if (!service || !['MTN', 'ORANGE'].includes(service)) throw new ApiError(400, 'Valid service (MTN or ORANGE) is required');

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  const user = await User.findById(req.userId);

  const existingEnrollment = await Enrollment.findOne({ student: req.userId, course: courseId });
  if (existingEnrollment) throw new ApiError(409, 'Already enrolled');

  const transaction = await Transaction.create({
    type: TRANSACTION_TYPES.COURSE_PAYMENT,
    amount: course.price,
    fromUser: req.userId,
    course: courseId,
    paymentProvider: PAYMENT_PROVIDERS.MESOMB,
    status: TRANSACTION_STATUS.PENDING,
    metadata: { phoneNumber, service },
  });

  const paymentResult = await initiateMeSombPayment({
    amount: course.price,
    phoneNumber,
    service,
    customerEmail: user.email,
    customerName: user.fullName,
    transactionId: transaction._id.toString(),
  });

  transaction.providerTransactionId = paymentResult.reference || '';
  transaction.providerReference = paymentResult.transaction?.id || '';
  await transaction.save();

  res.json({
    success: true,
    data: {
      transactionId: transaction._id,
      status: paymentResult.status,
      provider: transaction.paymentProvider,
    },
  });
});

const handleMeSombWebhook = catchAsync(async (req, res) => {
  const { event_type, data } = req.body;

  if (!data?.object?.reference) {
    return res.status(400).json({ success: false, message: 'Invalid webhook payload' });
  }

  const transaction = await Transaction.findById(data.object.reference);
  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  if (event_type === 'payment.transaction.succeeded') {
    transaction.status = TRANSACTION_STATUS.SUCCESS;
    transaction.providerTransactionId = data.object.id || transaction.providerTransactionId;
    await transaction.save();

    await Enrollment.create({
      student: transaction.fromUser,
      course: transaction.course,
      nextQuizDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await Course.findByIdAndUpdate(transaction.course, { $inc: { studentsEnrolledCount: 1 } });

    await createNotification({
      userId: transaction.fromUser,
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of ${transaction.amount} FCFA has been confirmed. You now have access to the course.`,
      link: '/student/courses',
    });
  } else if (event_type === 'payment.transaction.failed') {
    transaction.status = TRANSACTION_STATUS.FAILED;
    await transaction.save();
  }

  res.json({ success: true });
});

const verifyPayment = catchAsync(async (req, res) => {
  const { transactionId } = req.params;

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new ApiError(404, 'Transaction not found');

  res.json({ success: true, data: { status: transaction.status, transaction } });
});

module.exports = {
  initiatePayment,
  handleMeSombWebhook,
  verifyPayment,
};
