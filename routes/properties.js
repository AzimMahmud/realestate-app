const express = require("express");
const {
  getProperties,
  getPropertiesByUser,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesWithInRadius,
  propertyPhotoUpload,
} = require("../controllers/properties");

const advancedResults = require("../middleware/advancedResults");
const authenticatedSearch = require("../middleware/authenticatedSearch");
const Property = require("../models/Property");
const { protect, authorize } = require("../middleware/auth");

// Inclued other resource routers
const router = express.Router();

//Re-route into other resource routes

router
  .route("/")
  .get(advancedResults(Property), getProperties)
  .post(protect, authorize("user", "admin"), createProperty);

router.route("/users").get(authenticatedSearch(Property), getPropertiesByUser);

router.route("/:id/photo").put(propertyPhotoUpload);

router
  .route("/:id")
  .get(getProperty)
  .put(protect, authorize('user', 'admin'), updateProperty)
  .delete(protect, authorize('user', 'admin'), deleteProperty);

router.route("/radius/:zipcode/:distance").get(getPropertiesWithInRadius);

module.exports = router;
