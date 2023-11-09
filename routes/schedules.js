const express = require('express');
const {
  getSchedules,
  getSchedule,
  addSchedule,
  deleteSchedule

} = require('../controllers/schedules');

const Schedule = require('../models/Schedule');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Schedule, {
      path: 'property',
      select: 'name description'
    }),
    getSchedules
  )
  .post(protect, authorize('user', 'admin'), addSchedule);

router
  .route('/:id')
  .get(getSchedule)

  .delete(protect, authorize('user', 'admin'), deleteSchedule);

module.exports = router;
