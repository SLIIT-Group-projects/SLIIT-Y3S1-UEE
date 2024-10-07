const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decode.userId);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized access" });
      }

      req.user = user;
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }
  } catch (error) {
    console.error("Authorization Error: ", error);
    return res
      .status(401)
      .json({ success: false, message: "Token is invalid or expired" });
  }
};
