const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Live class title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  meetingUrl: {
    type: String,
    default: '',
  },
  platform: {
    type: String,
    enum: ['jitsi', 'zoom', 'google_meet', 'other'],
    default: 'jitsi',
  },
  recordingUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, {
  timestamps: true,
});

liveClassSchema.index({ teacher: 1, startDate: 1 });
liveClassSchema.index({ course: 1, startDate: 1 });

liveClassSchema.pre('validate', function (next) {
  if (this.endDate && this.startDate && this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

const LiveClass = mongoose.model('LiveClass', liveClassSchema);

module.exports = LiveClass;
