const express = require("express"),
  passport = require("passport");

const User = require("../models/user");

const router = express.Router();

router.get("/", function(req, res) {
  res.render("landing");
});

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  const newUser = new User({ username: req.body.username });
  const password = req.body.password;
  User.register(newUser, password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome To YelpCamp " + user.username);
      res.redirect("/restaurants");
    });
  });
});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged You Out!");
  res.redirect("/restaurants");
});

module.exports = router;
