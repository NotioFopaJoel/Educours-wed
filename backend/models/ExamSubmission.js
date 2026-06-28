const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: '',
  },
}, { _id: false });

const examSubmissionSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
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
  answers: [answerSchema],
  totalScore: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  isGraded: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  gradedAt: {
    type: Date,
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
}, {
  timestamps: true,
});

examSubmissionSchema.index({ exam: 1, student: 1 }, { unique: true });

const ExamSubmission = mongoose.model('ExamSubmission', examSubmissionSchema);

module.exports = ExamSubmission;
