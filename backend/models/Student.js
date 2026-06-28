const mongoose = require('mongoose');
const User = require('./User');
const { EDUCATION_SYSTEMS, ANGLOPHONE_LEVELS, FRANCOPHONE_LEVELS, ROLES } = require('../utils/constants');

const studentSchema = new mongoose.Schema({
  educationSystem: {
    type: String,
    enum: Object.values(EDUCATION_SYSTEMS),
    required: [true, 'Education system is required'],
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  region: {
    type: String,
    trim: true,
  },
  enrollments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
  }],
});

studentSchema.pre('validate', function (next) {
  const validLevels = this.educationSystem === EDUCATION_SYSTEMS.ANGLOPHONE
    ? ANGLOPHONE_LEVELS
    : FRANCOPHONE_LEVELS;
  if (!validLevels.includes(this.level)) {
    this.invalidate('level', `Invalid level for ${this.educationSystem} system. Must be one of: ${validLevels.join(', ')}`);
  }
  next();
});

const Student = User.discriminator(ROLES.STUDENT, studentSchema);

module.exports = Student;
