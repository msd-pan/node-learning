exports.getLogin = async (req, res, next) => {
  try {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: req.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    req.isLoggedIn = true;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
