const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
  },
  instructions: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String,
    default: '',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  totalPoints: {
    type: Number,
    required: true,
    default: 10,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  answerKey: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
