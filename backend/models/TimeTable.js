const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: [true, 'Day of week is required (0=Sunday, 6=Saturday)'],
    min: 0,
    max: 6,
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required (HH:mm)'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required (HH:mm)'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
  },
  activityType: {
    type: String,
    enum: ['live_class', 'exam', 'study', 'assignment', 'other'],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    default: '',
  },
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  entries: [timeEntrySchema],
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
  },
}, {
  timestamps: true,
});

timetableSchema.index({ user: 1 });
timetableSchema.index({ user: 1, course: 1 });

const TimeTable = mongoose.model('TimeTable', timetableSchema);

module.exports = TimeTable;
