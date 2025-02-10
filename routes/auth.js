const express = require("express");
const bcrypt = require("bcryptjs");

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Pls enter a valid email address~")
      .normalizeEmail(),
    body("password", "password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Pls enter a valid email~")
      .custom(async (value, { req }) => {
        //   if (value === "test@test.com") {
        //     throw new Error("this email is forbidden");
        //   }
        //   return true;
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject(
            "E-mail exists already,pls pick a different one"
          );
        }
      })
      .normalizeEmail(),
    body(
      "password",
      "pls enter a password with only 5 numbers and text and at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("passwords have to match !");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
