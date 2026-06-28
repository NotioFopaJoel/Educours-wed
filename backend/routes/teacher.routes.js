const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.TEACHER));

router.get('/dashboard', teacherController.getDashboard);
router.get('/courses', teacherController.getAssignedCourses);
router.get('/students', teacherController.getStudents);
router.get('/revenue', teacherController.getRevenue);

module.exports = router;
