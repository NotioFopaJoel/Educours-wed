const mongoose = require('mongoose');
const { ENROLLMENT_STATUS } = require('../utils/constants');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
  status: {
    type: String,
    enum: Object.values(ENROLLMENT_STATUS),
    default: ENROLLMENT_STATUS.ACTIVE,
  },
  lastQuizGeneratedAt: {
    type: Date,
  },
  nextQuizDueAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
