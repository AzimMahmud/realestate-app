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
      maxlength: [50, "Title can not be more than 50 characters."],
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description can not be more than 250 characters."],
    },
    category: {
      type: String,
      required: [true, "Please select a category."],
      // enum: ["For Rent", "For Sale"],
    },
    propertyType: {
      type: String,
      required: [true, "Please select a property type."],
      // enum: ["Apartment", "House", "Land"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    averageRating: {
      type: Number,
      min: [0, "Rating must be at least 1"],
      // max: [10, "Rating must can not be more than 10"],
    },
    price: Number,
    yearlyTaxRate: Number,
    homeOwnerAssociationFee: Number,
    afterPriceLabel: Number,
    beforePriceLabel: Number,
    images: {
      type: [String],
      required: [true, "Please upload at least one image"],
    },
    amenities: {
      type: [String],
    },
    address: {
      type: String,
    },
    videos: [],
    size: Number,
    lotSize: Number,
    rooms: Number,
    bedRooms: Number,
    bathrooms: Number,
    customID: String,
    garages: Number,
    garageSize: Number,
    yearBuilt: Number,
    availableFrom: Date,
    basement: String,
    roofing: String,
    extraDetails: String,
    exteriorMaterial: String,
    structureType: String,
    floorsNo: Number,
    propertyStatus: String,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Create Index for title full text search
PropertySchema.index({ title: "text" });

// Create Property slug from the title
PropertySchema.pre("save", function (next) {
  this.slug = slugify(this.title, {
    lower: true,
  });

  next();
});

// Geocode & create location field
// PropertySchema.pre("save", async function (next) {
//   console.log(this.address);
//   const loc = await geocoder.geocode(this.address);
//   this.location = {
//     type: "Point",
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//     street: loc[0].streetName,
//     city: loc[0].city,
//     state: loc[0].stateCode,
//     zipCode: loc[0].zipcode,
//     country: loc[0].countryCode,
//   };

//   // Do not save address in db
//   this.address = undefined;
//   next();
// });

// Cascade delete reviews when a property is deleted
PropertySchema.pre("remove", async function (next) {
  console.log(`Reviews being removed from property ${this._id}`);
  await this.model("Review").deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtuals
PropertySchema.virtual("reviewies", {
  ref: "Review",
  localField: "_id",
  foreignField: "property",
  justOne: false,
});

// Reverse populate with virtuals
PropertySchema.virtual('schedules', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'property',
  justOne: false,
});

module.exports = mongoose.model('Property', PropertySchema);
