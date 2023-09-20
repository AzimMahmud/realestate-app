const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", false);

  await mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true
    },
    console.log(`MongoDB Connected`.cyan.underline.bold)
  );
};

module.exports = connectDB;
