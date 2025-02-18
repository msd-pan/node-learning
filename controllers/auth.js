const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
// bcrypt的3.0版本似乎不能用

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email, name, password } = req.body;

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPw, name });
    const result = await user.save();

    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
