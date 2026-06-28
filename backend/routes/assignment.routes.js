const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.get('/course/:courseId', authenticate, assignmentController.getAssignments);
router.get('/:assignmentId', authenticate, assignmentController.getAssignment);

router.post('/course/:courseId', authenticate, authorize(ROLES.TEACHER), assignmentController.createAssignment);
router.put('/:assignmentId', authenticate, authorize(ROLES.TEACHER), assignmentController.updateAssignment);
router.delete('/:assignmentId', authenticate, authorize(ROLES.TEACHER), assignmentController.deleteAssignment);

router.post('/:assignmentId/submit', authenticate, authorize(ROLES.STUDENT), assignmentController.submitAssignment);
router.get('/:assignmentId/submissions', authenticate, authorize(ROLES.TEACHER), assignmentController.getSubmissions);
router.put('/submissions/:submissionId/grade', authenticate, authorize(ROLES.TEACHER), assignmentController.gradeAssignment);

module.exports = router;
