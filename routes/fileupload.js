/** @format */

const express = require("express");

const File = require("../models/File");
const advancedResults = require("../middleware/advancedResults");
const {
  photoUpload,
  photoNextUpload,
  getAllFiles,
  removeFile,
} = require("../controllers/fileUploadController");

const router = express.Router();

router.route("/").get(advancedResults(File), getAllFiles);

router.route("/photo").post(photoUpload);
router.route("/photo/client").post(photoNextUpload);
router.route("/:fileName").delete(removeFile);

module.exports = router;
