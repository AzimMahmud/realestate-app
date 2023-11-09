const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Schedule = require('../models/Schedule');
const Property = require('../models/Property');

// @desc      Get schedules
// @route     GET /api/v1/schedules
// @route     GET /api/v1/properties/:propertyId/schedules
// @access    Public
exports.getSchedules = asyncHandler(async (req, res, next) => {
  if (req.params.propertyId) {
    const schedules = await Schedule.find({ property: req.params.propertyId });

    return res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single schedule
// @route     GET /api/v1/schedules/:id
// @access    Public
exports.getSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!schedule) {
    return next(
      new ErrorResponse(`No schedule found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: schedule
  });
});

// @desc      Add schedule
// @route     POST /api/v1/properties/:propertyId/schedules
// @access    Private
exports.addSchedule= asyncHandler(async (req, res, next) => {
  req.body.property = req.params.propertyId;
  req.body.user = req.user.id;

  const property = await Property.findById(req.params.propertyId);

  if (!property) {
    return next(
      new ErrorResponse(
        `No property with the id of ${req.params.propertyId}`,
        404
      )
    );
  }

  const schedule = await Schedule.create(req.body);

  res.status(201).json({
    success: true,
    data: schedule
  });
});



// @desc      Delete schedule
// @route     DELETE /api/v1/schedules/:id
// @access    Private
exports.deleteSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return next(
      new ErrorResponse(`No schedule with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure schedule belongs to user or user is admin
  if (schedule.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update schedule`, 401));
  }

  await schedule.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});