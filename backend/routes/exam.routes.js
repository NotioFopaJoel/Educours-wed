const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.get('/course/:courseId', authenticate, examController.getExamsByCourse);
router.get('/:examId', authenticate, examController.getExam);

router.post('/course/:courseId', authenticate, authorize(ROLES.TEACHER), examController.createExam);
router.put('/:examId', authenticate, authorize(ROLES.TEACHER), examController.updateExam);
router.delete('/:examId', authenticate, authorize(ROLES.TEACHER), examController.deleteExam);

router.post('/:examId/submit', authenticate, authorize(ROLES.STUDENT), examController.submitExam);
router.get('/:examId/submissions', authenticate, authorize(ROLES.TEACHER), examController.getSubmissions);
router.put('/submissions/:submissionId/grade', authenticate, authorize(ROLES.TEACHER), examController.gradeExam);

module.exports = router;
