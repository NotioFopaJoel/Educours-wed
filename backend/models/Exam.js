const mongoose = require('mongoose');

const examQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'essay', 'short_answer'],
    required: true,
  },
  options: [String],
  correctAnswer: {
    type: String,
  },
  points: {
    type: Number,
    required: true,
    default: 1,
  },
}, { _id: false });

const examSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  questions: {
    type: [examQuestionSchema],
    validate: {
      validator: function (v) { return v.length > 0; },
      message: 'At least one question is required',
    },
  },
  duration: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: 1,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

examSchema.pre('save', function (next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  next();
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
