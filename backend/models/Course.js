const mongoose = require('mongoose');
const { EDUCATION_SYSTEMS } = require('../utils/constants');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    minlength: 10,
    maxlength: 5000,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  educationSystem: {
    type: String,
    enum: Object.values(EDUCATION_SYSTEMS),
    required: [true, 'Education system is required'],
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  coverImage: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  assignedTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  }],
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  studentsEnrolledCount: {
    type: Number,
    default: 0,
  },
  totalLessons: {
    type: Number,
    default: 0,
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

courseSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now();
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
