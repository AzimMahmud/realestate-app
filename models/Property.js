const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const geocoder = require("../utils/geocoder");

const PropertySchema = new mongoose.Schema(
  {},
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
