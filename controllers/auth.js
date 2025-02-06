const User = require("../models/user");

exports.getLogin = async (req, res, next) => {
  try {
    console.log(req.session.isLoggedIn);
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
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
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
