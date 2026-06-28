const TimeTable = require('../models/TimeTable');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createTimetable = catchAsync(async (req, res) => {
  const timetable = await TimeTable.create({
    ...req.body,
    user: req.userId,
  });
  res.status(201).json({ success: true, data: timetable });
});

const updateTimetable = catchAsync(async (req, res) => {
  const timetable = await TimeTable.findOneAndUpdate(
    { _id: req.params.timetableId, user: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!timetable) throw new ApiError(404, 'Timetable not found or not authorized');
  res.json({ success: true, data: timetable });
});

const getTimetable = catchAsync(async (req, res) => {
  const timetable = await TimeTable.findOne({ user: req.userId });
  if (!timetable) {
    return res.json({ success: true, data: { entries: [] } });
  }
  res.json({ success: true, data: timetable });
});

const deleteTimetable = catchAsync(async (req, res) => {
  const timetable = await TimeTable.findOneAndDelete({
    _id: req.params.timetableId,
    user: req.userId,
  });
  if (!timetable) throw new ApiError(404, 'Timetable not found or not authorized');
  res.json({ success: true, message: 'Timetable deleted' });
});

const addEntry = catchAsync(async (req, res) => {
  let timetable = await TimeTable.findOne({ user: req.userId });
  if (!timetable) {
    timetable = await TimeTable.create({ user: req.userId, entries: [] });
  }

  timetable.entries.push(req.body);
  await timetable.save();

  const addedEntry = timetable.entries[timetable.entries.length - 1];
  res.status(201).json({ success: true, data: addedEntry });
});

const removeEntry = catchAsync(async (req, res) => {
  const { entryId } = req.params;
  const timetable = await TimeTable.findOne({ user: req.userId });
  if (!timetable) throw new ApiError(404, 'Timetable not found');

  const entryIndex = timetable.entries.findIndex(
    (e) => e._id.toString() === entryId
  );
  if (entryIndex === -1) throw new ApiError(404, 'Entry not found');

  timetable.entries.splice(entryIndex, 1);
  await timetable.save();

  res.json({ success: true, message: 'Entry removed' });
});

module.exports = {
  createTimetable,
  updateTimetable,
  getTimetable,
  deleteTimetable,
  addEntry,
  removeEntry,
};
