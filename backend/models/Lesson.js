const mongoose = require('mongoose');
const { LESSON_TYPES } = require('../utils/constants');

const lessonSchema = new mongoose.Schema({
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: Object.values(LESSON_TYPES),
    required: [true, 'Lesson type is required'],
  },
  contentUrl: {
    type: String,
    default: '',
  },
  textContent: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
    min: 0,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

lessonSchema.index({ chapter: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
