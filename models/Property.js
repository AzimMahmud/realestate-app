const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const geocoder = require("../utils/geocoder");

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title."],
      unique: true,
      trim: true,
      maxlength: [50, "Title can not be more than 50 characters."]
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description can not be more than 250 characters."]
    },
    category: {
      type: String,
      required: [true, "Please select a category."],
      enum: [
        "For Rent",
        "For Sale"
      ]
    },
    propertyType: {
      type: String,
      required: [true, "Please select a property type."],
      enum: [
        "Apartment",
        "House",
        "Land"
      ]
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"]
    },
    price: Number,
    yearlyTaxtRate: Number,
    homeOwnerAssociationFee: Number,
    afterPriceLabel: Number,
    beforePriceLabel: Number,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
