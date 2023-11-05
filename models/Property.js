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
      enum: ["For Rent", "For Sale"]
    },
    propertyType: {
      type: String,
      required: [true, "Please select a property type."],
      enum: ["Apartment", "House", "Land"]
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
    images: {
      type: [String],
      required: [true, "Please upload at least one image"]
    },
    amenities: {
      type: [String]
    },
    size: Number,
    lotSize: Number,
    rooms: Number,
    bedRooms: Number,
    customID: String,
    garages: Number,
    garageSize: Number,
    yearBuilt: Number,
    availableForm: Date,
    basement: String,
    roofing: String,
    extraDetails: String,
    exteriorMaterial: String,
    structureType: String,
    floorsNo: Number
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


// Create Property slug from the name
PropertySchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });

  next();
});

// Geocode & create location field
PropertySchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  // Do not save address in db
  this.address = undefined;
  next();
});



module.exports = mongoose.model("Property", PropertySchema);
