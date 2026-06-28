const mongoose = require('mongoose');
const User = require('./User');
const { TEACHER_YEARS, TEACHER_STATUS, ROLES } = require('../utils/constants');

const teacherSchema = new mongoose.Schema({
  university: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
  },
  yearOfStudy: {
    type: String,
    enum: TEACHER_YEARS,
    required: [true, 'Year of study is required'],
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Field of study is required'],
    trim: true,
  },
  subjectsCanTeach: {
    type: [String],
    required: [true, 'At least one subject is required'],
    validate: {
      validator: function (v) { return v.length > 0; },
      message: 'At least one subject must be specified',
    },
  },
  levelsCanTeach: {
    type: [String],
    required: [true, 'At least one level is required'],
    validate: {
      validator: function (v) { return v.length > 0; },
      message: 'At least one level must be specified',
    },
  },
  paymentMethod: {
    provider: {
      type: String,
      enum: ['MTN', 'ORANGE'],
      required: [true, 'Payment provider is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Payment phone number is required'],
      trim: true,
    },
  },
  status: {
    type: String,
    enum: Object.values(TEACHER_STATUS),
    default: TEACHER_STATUS.PENDING,
  },
  assignedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  totalRevenueGenerated: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalPaidOut: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Teacher = User.discriminator(ROLES.TEACHER, teacherSchema);

module.exports = Teacher;
