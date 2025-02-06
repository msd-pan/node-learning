const User = require("../models/user");

exports.getLogin = async (req, res, next) => {
  try {
    // console.log(req.session.isLoggedIn);
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: req.session.isLoggedIn,
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
    req.session.isLoggedIn = true;
    req.session.user = await User.findById("67a2c1b949e95c0991ae2a48");
    await req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
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

    const user = new User({ email, password, cart: { items: [] } });
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
