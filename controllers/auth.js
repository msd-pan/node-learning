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
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
