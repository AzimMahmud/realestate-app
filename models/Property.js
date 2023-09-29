const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const geocoder = require("../utils/geocoder");

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      unique: true,
      trim: true,
      maxlength: [50, "Title can not be more than 50 characters"]
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description can not be more than 250 characters"]
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Rent",
        "Sale"
      ]
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "Apartment",
        "House"
      ]
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
