const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sharp = require("sharp");

exports.createUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ userName: userName }, { email: email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or password is already in use" });
    }

    const user = await User({
      userName,
      email,
      password,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating User", error });
  }
};

exports.userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Email or password doesn't match",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.uploadProfile = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    console.log(req.file);

    const profileBuffer = req.file.buffer;
    const { width, height } = await sharp(profileBuffer).metadata();
    const avatar = await sharp(profileBuffer)
      .resize(Math.round(width * 0.5), Math.round(height * 0.5))
      .toBuffer();

    await User.findByIdAndUpdate(user._id, { avatar });

    res.json({
      success: true,
      message: "Profile uploaded successfully",
      imageInfo,
    });
  } catch (error) {
    console.error("Upload Error: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing the file" });
  }
};
