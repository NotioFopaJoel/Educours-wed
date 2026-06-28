const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Teacher = require('../models/Teacher');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createCourse = catchAsync(async (req, res) => {
  const course = await Course.create({
    ...req.body,
    createdBy: req.userId,
  });

  res.status(201).json({ success: true, data: course });
});

const updateCourse = catchAsync(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) throw new ApiError(404, 'Course not found');
  res.json({ success: true, data: course });
});

const deleteCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  await Chapter.deleteMany({ course: course._id });
  await Lesson.deleteMany({ _id: { $in: course.chapters } });
  await course.deleteOne();

  res.json({ success: true, message: 'Course deleted' });
});

const getCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.courseId)
    .populate({
      path: 'chapters',
      populate: { path: 'lessons', options: { sort: { order: 1 } } },
      options: { sort: { order: 1 } },
    })
    .populate('assignedTeachers', 'fullName email avatar');

  if (!course) throw new ApiError(404, 'Course not found');
  res.json({ success: true, data: course });
});

const getAllCourses = catchAsync(async (req, res) => {
  const { educationSystem, level, subject, isPublished, page = 1, limit = 20 } = req.query;
  const query = {};
  if (educationSystem) query.educationSystem = educationSystem;
  if (level) query.level = level;
  if (subject) query.subject = { $regex: subject, $options: 'i' };
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('assignedTeachers', 'fullName avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Course.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: { courses, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
  });
});

const assignTeacher = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { teacherId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new ApiError(404, 'Teacher not found');
  if (teacher.status !== 'approved') throw new ApiError(400, 'Teacher is not approved');

  if (!course.assignedTeachers.includes(teacherId)) {
    course.assignedTeachers.push(teacherId);
    await course.save();
  }

  if (!teacher.assignedCourses.includes(courseId)) {
    teacher.assignedCourses.push(courseId);
    await teacher.save();
  }

  res.json({ success: true, message: 'Teacher assigned to course', data: course });
});

const removeTeacher = catchAsync(async (req, res) => {
  const { courseId, teacherId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  course.assignedTeachers = course.assignedTeachers.filter((id) => id.toString() !== teacherId);
  await course.save();

  const teacher = await Teacher.findById(teacherId);
  if (teacher) {
    teacher.assignedCourses = teacher.assignedCourses.filter((id) => id.toString() !== courseId);
    await teacher.save();
  }

  res.json({ success: true, message: 'Teacher removed from course' });
});

const addChapter = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  const chapterCount = await Chapter.countDocuments({ course: courseId });
  const chapter = await Chapter.create({
    ...req.body,
    course: courseId,
    order: chapterCount + 1,
  });

  course.chapters.push(chapter._id);
  await course.save();

  res.status(201).json({ success: true, data: chapter });
});

const updateChapter = catchAsync(async (req, res) => {
  const chapter = await Chapter.findByIdAndUpdate(req.params.chapterId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!chapter) throw new ApiError(404, 'Chapter not found');
  res.json({ success: true, data: chapter });
});

const deleteChapter = catchAsync(async (req, res) => {
  const chapter = await Chapter.findById(req.params.chapterId);
  if (!chapter) throw new ApiError(404, 'Chapter not found');

  await Lesson.deleteMany({ chapter: chapter._id });
  await Course.findByIdAndUpdate(chapter.course, { $pull: { chapters: chapter._id } });
  await chapter.deleteOne();

  res.json({ success: true, message: 'Chapter deleted' });
});

const addLesson = catchAsync(async (req, res) => {
  const { chapterId } = req.params;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) throw new ApiError(404, 'Chapter not found');

  const lessonCount = await Lesson.countDocuments({ chapter: chapterId });
  const lesson = await Lesson.create({
    ...req.body,
    chapter: chapterId,
    order: lessonCount + 1,
  });

  chapter.lessons.push(lesson._id);
  await chapter.save();

  res.status(201).json({ success: true, data: lesson });
});

const updateLesson = catchAsync(async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  res.json({ success: true, data: lesson });
});

const deleteLesson = catchAsync(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found');

  await Chapter.findByIdAndUpdate(lesson.chapter, { $pull: { lessons: lesson._id } });
  await lesson.deleteOne();

  res.json({ success: true, message: 'Lesson deleted' });
});

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getAllCourses,
  assignTeacher,
  removeTeacher,
  addChapter,
  updateChapter,
  deleteChapter,
  addLesson,
  updateLesson,
  deleteLesson,
};
