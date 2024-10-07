const { check, validationResult } = require("express-validator");

exports.validateUserSignUp = [
  check("userName")
    .trim()
    .not()
    .isEmpty()
    .isString()
    .withMessage("Enter a valid Username")
    .isLength({ min: 3, max: 20 })
    .withMessage("UserName must be 3-20 characters"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid Email"),
  check("password").trim().not().isEmpty().withMessage("Enter a password"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Both passwords must be same");
      }
      return true;
    }),
];

exports.validateUserSignIn = [
  check("email").trim().isEmail().withMessage("email / password is required"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email / password is required"),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  res.json({ success: false, message: error });
};
