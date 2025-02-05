exports.getLogin = async (req, res, next) => {
  try {
    // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
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
    res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
