const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.get('/my', authenticate, authorize(ROLES.STUDENT), quizController.getQuizzes);
router.get('/my/results', authenticate, authorize(ROLES.STUDENT), quizController.getResults);
router.get('/:quizId', authenticate, authorize(ROLES.STUDENT), quizController.getQuizById);
router.post('/:quizId/submit', authenticate, authorize(ROLES.STUDENT), quizController.submitQuiz);
router.get('/course/:courseId/results', authenticate, authorize(ROLES.TEACHER), quizController.getStudentsQuizResults);

module.exports = router;
