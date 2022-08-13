const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const passport = require("passport");

const loginConfig = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login",
  keepSessionInfo: true,
  failureMessage: true,
});
const userCRUD = require("../controllers/user");

router
  .route("/register")
  .get(userCRUD.renderRegister)
  .post(asyncWrapper(userCRUD.userRegister));

router
  .route("/login")
  .get(userCRUD.renderLogin)
  .post(loginConfig, userCRUD.userLogin)
  .get(userCRUD.userLogout);

module.exports = router;
