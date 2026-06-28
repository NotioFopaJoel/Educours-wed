const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const enrollmentController = require('../controllers/enrollment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourse);

router.post('/', authenticate, authorize(ROLES.ADMIN), courseController.createCourse);
router.put('/:courseId', authenticate, authorize(ROLES.ADMIN), courseController.updateCourse);
router.delete('/:courseId', authenticate, authorize(ROLES.ADMIN), courseController.deleteCourse);

router.post('/:courseId/assign-teacher', authenticate, authorize(ROLES.ADMIN), courseController.assignTeacher);
router.delete('/:courseId/teachers/:teacherId', authenticate, authorize(ROLES.ADMIN), courseController.removeTeacher);

router.post('/:courseId/enroll', authenticate, authorize(ROLES.STUDENT), enrollmentController.enrollStudent);
router.get('/:courseId/enrollments', authenticate, authorize(ROLES.ADMIN, ROLES.TEACHER), enrollmentController.getEnrollmentsByCourse);

router.post('/:courseId/chapters', authenticate, authorize(ROLES.ADMIN), courseController.addChapter);
router.put('/chapters/:chapterId', authenticate, authorize(ROLES.ADMIN), courseController.updateChapter);
router.delete('/chapters/:chapterId', authenticate, authorize(ROLES.ADMIN), courseController.deleteChapter);

router.post('/chapters/:chapterId/lessons', authenticate, authorize(ROLES.ADMIN), courseController.addLesson);
router.put('/lessons/:lessonId', authenticate, authorize(ROLES.ADMIN), courseController.updateLesson);
router.delete('/lessons/:lessonId', authenticate, authorize(ROLES.ADMIN), courseController.deleteLesson);

module.exports = router;
