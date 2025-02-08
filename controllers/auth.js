const crypto = require("crypto");

const bcrypt = require("bcryptjs");
// It provides a way to encrypt passwords before storing them in a database, ensuring that even if the database is compromised, attackers cannot easily retrieve the original passwords

const nodemailer = require("nodemailer");
// Require:
const postmark = require("postmark");

const { validationResult } = require("express-validator");
// Send an email:
const client = new postmark.Client("d594640e-45a8-4111-98ad-4124c0ab8167");

const getMessage = (email, subject, body) => {
  return {
    From: "jixiao.pan@msdcorp.co.jp",
    To: email,
    Subject: subject,
    TextBody: body,
    HtmlBody: `${body}`,
  };
};

const sendEmail = async (email, subject, body) => {
  try {
    await client.sendEmail(getMessage(email, subject, body));
    console.log("Test email sent successfully");
  } catch (error) {
    console.error("Error sending test email");
    console.error(error);
  }
};

const User = require("../models/user");
const { buffer } = require("stream/consumers");

exports.getLogin = async (req, res, next) => {
  try {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: message,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = async (req, res, next) => {
  try {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: message,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password! ");
      return res.redirect("/login");
    }
    const doMatch = await bcrypt.compare(password, user.password);

    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        if (err) console.log("Session save error:", err);
        res.redirect("/");
      });
    }
    req.flash("error", "Invalid email or password! ");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
      });
    }

    const userDoc = await User.findOne({ email });
    if (userDoc) {
      req.flash("error", "E-mail exists already,pls pick a different one");
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await sendEmail(
      email,
      "Signup succeeded!",
      "You successfully signed up at xiaoka's application"
    );
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash("error", "No account with that email found.");
      return res.redirect("/reset");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1-hour expiration
    await user.save();

    const body = `
    <p>You requested a password reset</p>
    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password
    `;
    await sendEmail(req.body.email, "Password Reset!", body);

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    // $gt means greater

    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render("auth/new-password", {
      pageTitle: "New Password",
      path: "/new-password",
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const { userId, passwordToken } = req.body;
    const newPassword = req.body.password;

    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
