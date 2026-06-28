const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, LANGUAGES, THEMES, FONT_SIZES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: [true, 'Role is required'],
  },
  language: {
    type: String,
    enum: Object.values(LANGUAGES),
    default: LANGUAGES.EN,
  },
  theme: {
    type: String,
    enum: Object.values(THEMES),
    default: THEMES.LIGHT,
  },
  fontSize: {
    type: String,
    enum: Object.values(FONT_SIZES),
    default: FONT_SIZES.NORMAL,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpires: {
    type: Date,
  },
  resetPasswordCode: {
    type: String,
  },
  resetPasswordCodeExpires: {
    type: Date,
  },
  avatar: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  hasCompletedOnboarding: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  discriminatorKey: 'role',
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationCode;
  delete obj.verificationCodeExpires;
  delete obj.resetPasswordCode;
  delete obj.resetPasswordCodeExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
