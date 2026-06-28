const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
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
  content: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    min: 0,
  },
  maxScore: {
    type: Number,
  },
  feedback: {
    type: String,
    default: '',
  },
  isGraded: {
    type: Boolean,
    default: false,
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  gradedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

module.exports = AssignmentSubmission;
