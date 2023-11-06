const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// Load env file
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDb
connectDB();


const app = express();

// Body Parse
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File Upload
app.use(fileUpload());

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routes
app.use("/api/v1/properties", require("./routes/properties"));
// app.use("/api/v1/courses", require("./routes/courses"));

// Error Handle
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .bgBlue.bold
  )
);

// Handle unhandle rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.bgRed.white);
  // Close server &  exit process
  // server.close(() => process.exit());
});
