const bcrypt = require("bcryptjs");
// It provides a way to encrypt passwords before storing them in a database, ensuring that even if the database is compromised, attackers cannot easily retrieve the original passwords

const User = require("../models/user");

exports.getLogin = async (req, res, next) => {
  try {
    // console.log(req.session.isLoggedIn);
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = async (req, res, next) => {
  try {
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
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
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
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
