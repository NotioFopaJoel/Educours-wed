const express = require('express');
const router = express.Router();
const liveclassController = require('../controllers/liveclass.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.get('/', authenticate, liveclassController.getLiveClasses);
router.get('/:liveClassId', authenticate, liveclassController.getLiveClass);

router.post('/course/:courseId', authenticate, authorize(ROLES.TEACHER), liveclassController.createLiveClass);
router.put('/:liveClassId', authenticate, authorize(ROLES.TEACHER), liveclassController.updateLiveClass);
router.delete('/:liveClassId', authenticate, authorize(ROLES.TEACHER), liveclassController.deleteLiveClass);
router.patch('/:liveClassId/start', authenticate, authorize(ROLES.TEACHER), liveclassController.startLiveClass);
router.patch('/:liveClassId/end', authenticate, authorize(ROLES.TEACHER), liveclassController.endLiveClass);

module.exports = router;
