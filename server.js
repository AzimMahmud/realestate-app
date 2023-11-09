const path = require("path");
const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const morgan = require("morgan");
const upload = require("express-fileupload");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Route files
const properties = require("./routes/properties");
const reviews = require("./routes/reviews");
const schedules = require("./routes/schedules");
const auth = require("./routes/auth");
const users = require("./routes/users");
const fileUpload = require("./routes/fileupload");

// Load env file
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDb
connectDB();

const app = express();

// Body Parse
app.use(express.json());
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File Upload
app.use(upload());

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routes
app.use("/api/v1/properties", properties);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/schedules", schedules);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/fileupload", fileUpload);

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
  //Close server &  exit process
  server.close(() => process.exit());
});
