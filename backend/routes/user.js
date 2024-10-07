const express = require("express");
const multer = require("multer");

const router = express.Router();
const { createUser, userSignIn } = require("../controllers/user");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validations/user");
const { isAuth } = require("../middleware/auth");
const User = require("../models/user");

const storage = multer.diskStorage({}); // Example storage configuration
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
router.post("/upload-profile", isAuth, uploads.single("profile"));

module.exports = router;
