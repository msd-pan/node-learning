const bcrypt = require("bcryptjs");
// It provides a way to encrypt passwords before storing them in a database, ensuring that even if the database is compromised, attackers cannot easily retrieve the original passwords

const nodemailer = require("nodemailer");
// Require:
const postmark = require("postmark");
// Send an email:
const client = new postmark.Client("d594640e-45a8-4111-98ad-4124c0ab8167");

const getMessage = (email) => {
  const body = "You successfully signed up at xiaoka's application";
  return {
    From: "jixiao.pan@msdcorp.co.jp",
    To: email,
    Subject: "Signup succeeded!",
    TextBody: body,
    HtmlBody: `${body}`,
  };
};

const sendEmail = async (email) => {
  try {
    await client.sendEmail(getMessage(email));
    console.log("Test email sent successfully");
  } catch (error) {
    console.error("Error sending test email");
    console.error(error);
  }
};

const User = require("../models/user");

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
    const { email, password, confirmPassword } = req.body;
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
    await sendEmail(email);
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
