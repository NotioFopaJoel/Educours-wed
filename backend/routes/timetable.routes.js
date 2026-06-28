const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetable.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.post('/', timetableController.createTimetable);
router.get('/', timetableController.getTimetable);
router.put('/:timetableId', timetableController.updateTimetable);
router.delete('/:timetableId', timetableController.deleteTimetable);
router.post('/entries', timetableController.addEntry);
router.delete('/entries/:entryId', timetableController.removeEntry);

module.exports = router;
