const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function (v) { return v.length >= 2; },
      message: 'At least 2 options are required',
    },
  },
  correctAnswerIndex: {
    type: Number,
    required: [true, 'Correct answer index is required'],
  },
  chapterReference: {
    type: String,
    default: '',
  },
  explanation: {
    type: String,
    default: '',
  },
}, { _id: false });

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  month: {
    type: String,
    required: [true, 'Month is required (format: YYYY-MM)'],
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function (v) { return v.length === 15; },
      message: 'Exactly 15 questions are required per quiz',
    },
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

quizSchema.index({ enrollment: 1, month: 1 }, { unique: true });
quizSchema.index({ student: 1, month: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
