const Joi = require('joi');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/generateToken');
const { generateVerificationCode } = require('../utils/generateCode');
const { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail } = require('../services/email.service');
const { createNotification } = require('../services/notification.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ROLES, EDUCATION_SYSTEMS, TEACHER_YEARS } = require('../utils/constants');

const registerStudentSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  phone: Joi.string().required(),
  educationSystem: Joi.string().valid(...Object.values(EDUCATION_SYSTEMS)).required(),
  level: Joi.string().required(),
  country: Joi.string().required(),
  region: Joi.string().allow(''),
  language: Joi.string().valid('en', 'fr').default('en'),
});

const registerTeacherSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  phone: Joi.string().required(),
  university: Joi.string().required(),
  yearOfStudy: Joi.string().valid(...TEACHER_YEARS).required(),
  fieldOfStudy: Joi.string().required(),
  subjectsCanTeach: Joi.array().items(Joi.string()).min(1).required(),
  levelsCanTeach: Joi.array().items(Joi.string()).min(1).required(),
  paymentMethod: Joi.object({
    provider: Joi.string().valid('MTN', 'ORANGE').required(),
    phoneNumber: Joi.string().required(),
  }).required(),
  language: Joi.string().valid('en', 'fr').default('en'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  password: Joi.string().min(8).max(128).required(),
});

const registerStudent = catchAsync(async (req, res) => {
  const { error, value } = registerStudentSchema.validate(req.body);
  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', details);
  }

  const existingUser = await User.findOne({ email: value.email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const verificationCode = generateVerificationCode();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  const student = await Student.create({
    ...value,
    role: ROLES.STUDENT,
    verificationCode,
    verificationCodeExpires,
  });

  sendVerificationEmail(value.email, verificationCode).catch((err) => {
    console.warn('Verification email failed (registration continues):', err.message);
  });

  res.status(201).json({
    success: true,
    message: 'Account created. Please check your email for the verification code.',
    data: { email: student.email },
  });
});

const registerTeacher = catchAsync(async (req, res) => {
  const { error, value } = registerTeacherSchema.validate(req.body);
  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', details);
  }

  const existingUser = await User.findOne({ email: value.email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const verificationCode = generateVerificationCode();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  const teacher = await Teacher.create({
    ...value,
    role: ROLES.TEACHER,
    status: 'pending',
    verificationCode,
    verificationCodeExpires,
  });

  sendVerificationEmail(value.email, verificationCode).catch((err) => {
    console.warn('Verification email failed (registration continues):', err.message);
  });

  await createNotification({
    userId: teacher._id,
    type: 'welcome',
    title: 'Account Created',
    message: 'Your teacher account has been created. Please wait for admin approval.',
  });

  res.status(201).json({
    success: true,
    message: 'Account created. Please check your email for the verification code. Your account is pending admin approval.',
    data: { email: teacher.email },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { error, value } = verifyEmailSchema.validate(req.body);
  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', details);
  }

  const user = await User.findOne({ email: value.email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.isVerified) {
    throw new ApiError(400, 'Email already verified');
  }
  if (user.verificationCode !== value.code) {
    throw new ApiError(400, 'Invalid verification code');
  }
  if (user.verificationCodeExpires < new Date()) {
    throw new ApiError(400, 'Verification code has expired');
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  await sendWelcomeEmail(user.email, user.fullName, user.language);

  await createNotification({
    userId: user._id,
    type: 'welcome',
    title: user.language === 'fr' ? 'Bienvenue sur EDUCOURS !' : 'Welcome to EDUCOURS!',
    message: user.language === 'fr'
      ? 'Votre compte est maintenant actif. Commencez à apprendre !'
      : 'Your account is now active. Start learning!',
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  res.json({
    success: true,
    message: 'Email verified successfully',
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        language: user.language,
        theme: user.theme,
        fontSize: user.fontSize,
        avatar: user.avatar,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
      accessToken,
      refreshToken,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', details);
  }

  const user = await User.findOne({ email: value.email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact support.');
  }

  const isPasswordValid = await user.comparePassword(value.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isVerified) {
    const code = generateVerificationCode();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(user.email, code);

    throw new ApiError(403, 'Please verify your email first. A new verification code has been sent.');
  }

  if (user.role === ROLES.TEACHER) {
    const teacher = await Teacher.findById(user._id);
    if (teacher && teacher.status === 'pending') {
      throw new ApiError(403, 'Your teacher account is pending admin approval. Please wait.');
    }
    if (teacher && teacher.status === 'suspended') {
      throw new ApiError(403, 'Your teacher account has been suspended. Contact support.');
    }
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  const userData = user.toJSON();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        ...userData,
        id: user._id,
      },
      accessToken,
      refreshToken,
    },
  });
});

const refreshTokenHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or deactivated');
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id, user.role);

  res.json({
    success: true,
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', details);
  }

  const user = await User.findOne({ email: value.email });
  if (!user) {
    throw new ApiError(404, 'No account found with this email');
  }

  const code = generateVerificationCode();
  user.resetPasswordCode = code;
  user.resetPasswordCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendResetPasswordEmail(user.email, code);

  res.json({
    success: true,
    message: 'Password reset code sent to your email',
    data: { email: user.email },
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', details);
  }

  const user = await User.findOne({ email: value.email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.resetPasswordCode !== value.code) {
    throw new ApiError(400, 'Invalid reset code');
  }
  if (user.resetPasswordCodeExpires < new Date()) {
    throw new ApiError(400, 'Reset code has expired');
  }

  user.password = value.password;
  user.resetPasswordCode = undefined;
  user.resetPasswordCodeExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully. You can now log in.',
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const allowedFields = ['fullName', 'phone', 'language', 'theme', 'fontSize'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: user.toJSON() },
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, 'Validation failed', details);
  }

  const user = await User.findById(req.userId).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.comparePassword(value.currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = value.newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let profileData = { ...user.toJSON(), id: user._id };

  if (user.role === ROLES.STUDENT) {
    const student = await Student.findById(user._id).populate('enrollments');
    profileData = { ...profileData, ...student?.toJSON() };
  } else if (user.role === ROLES.TEACHER) {
    const teacher = await Teacher.findById(user._id).populate('assignedCourses');
    profileData = { ...profileData, ...teacher?.toJSON() };
  }

  res.json({ success: true, data: profileData });
});

const completeOnboarding = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { hasCompletedOnboarding: true },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.json({ success: true, message: 'Onboarding completed', data: { hasCompletedOnboarding: true } });
});

module.exports = {
  registerStudent,
  registerTeacher,
  verifyEmail,
  login,
  refreshTokenHandler,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  getProfile,
  completeOnboarding,
};
