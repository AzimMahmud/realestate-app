const express = require("express");
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesWithInRadius,
  propertyPhotoUpload
} = require("../controllers/properties");

const advancedResults = require("../middleware/advancedResults");
const Property = require("../models/Property");

// Inclued other resource routers
const router = express.Router();

//Re-route into other resource routes

router
  .route("/")
  .get(advancedResults(Property), getProperties)
  .post(createProperty);

router.route("/:id/photo").put(propertyPhotoUpload);

router
  .route("/:id")
  .get(getProperty)
  .put(updateProperty)
  .delete(deleteProperty);

router.route("/radius/:zipcode/:distance").get(getPropertiesWithInRadius);

module.exports = router;
