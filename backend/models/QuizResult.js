const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
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
  answers: {
    type: [Number],
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  scoreOutOf20: {
    type: Number,
    min: 0,
    max: 20,
  },
  weakChapters: [{
    type: String,
  }],
  teacherNotes: {
    type: String,
    default: '',
  },
  sentToTeacherAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

quizResultSchema.pre('save', function (next) {
  this.scoreOutOf20 = Math.round((this.score / 100) * 20 * 100) / 100;
  next();
});

quizResultSchema.index({ student: 1, course: 1 });
quizResultSchema.index({ quiz: 1 }, { unique: true });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
