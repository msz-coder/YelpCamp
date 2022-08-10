const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const User = require("../models/user");
const passport = require("passport");

const loginConfig = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login",
  keepSessionInfo: true,
  failureMessage: true,
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  asyncWrapper(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registerdUser = await User.register(user, password);
      req.login(registerdUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Yelp Camp");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", loginConfig, (req, res) => {
  req.flash("success", "Welcome Back");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "See you again later!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
