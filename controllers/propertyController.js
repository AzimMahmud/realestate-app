const path = require("path");
const asyncHandler = require("../middlewares/async");
const Property = require("../models/Property");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc       Get all Properties
// @route      GET /api/v1/properties
// @access     Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  console.log(res.advancedResults);
  res.status(200).json({
    success: true,
    data: res.advancedResults
  });
});

// @desc       Get Property
// @route      GET /api/v1/properties/:id
// @access     Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc       Create new Property
// @route      POST /api/v1/properties
// @access     Private
exports.createProperty = asyncHandler(async (req, res, next) => {
  const { _id } = await Property.create(req.body);

  res.status(201).json({
    success: true,
    message: "Create new property",
    data: {
      id: _id
    }
  });
});

// @desc       Update property
// @route      PUT /api/v1/properties/:id
// @access     Private
exports.updateProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  if (!property) {
    res.status(400).json({
      success: false,
      message: "Data not found"
    });
  }

  res.status(201).json({
    success: true,
    data: property
  });
});

// @desc       Delete property
// @route      DELETE /api/v1/properties/:id
// @access     Private
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  property.remove();

  res.status(201).json({
    success: true,
    message: "Deleted successfully"
  });
});

// @desc       Get properties within a radius
// @route      DELETE /api/v1/properties/radius/:zipcode/:distance
// @access     Private
exports.getPropertiesWithInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode: postalCode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(postalCode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  // Calculate radius using radians
  // Divide distance by radius of earth
  // Earth radius = 3963 mi / 6378 km
  const radius = distance / 3963;

  const properties = await Property.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lon, lat], radius]
      }
    }
  });

  if (!properties) {
    res.status(400).json({
      success: false,
      message: "Data not found"
    });
  }

  res.status(200).json({
    success: true,
    data: properties
  });
});

// @desc       Upload photo for property
// @route      PUT /api/v1/properties/:id/photo
// @access     Private
exports.propertyPhotoUpload = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }

  const file = req.files.files;

  // Make sure the image is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image file less then ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom file name
  file.name = `photo_${property._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      new ErrorResponse(`Problem with file upload`, 500);
    }

    await Property.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: file.name
    });
  });
});
