const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.STUDENT));

router.get('/dashboard', studentController.getDashboard);
router.get('/enrollments', studentController.getEnrollments);
router.get('/enrollments/:enrollmentId', studentController.getEnrollmentDetail);
router.put('/enrollments/:enrollmentId/progress', studentController.updateLessonProgress);
router.get('/quiz-results', studentController.getQuizResults);
router.get('/transactions', studentController.getTransactions);

module.exports = router;
