const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    required: true,
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
}, {
  timestamps: true,
});

chapterSchema.index({ course: 1, order: 1 });

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
