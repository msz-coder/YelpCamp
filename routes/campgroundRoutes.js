const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utils/asyncWrapper");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../utils/middlewares");
const campCRUD = require("../controllers/campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(asyncWrapper(campCRUD.viewCampgrounds)) //View All Campgrounds Route
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    asyncWrapper(campCRUD.postCampground)
  ); //Posting new Campground Details Route

router.get("/new", isLoggedIn, campCRUD.newCampground); //Create new Campground Route

router
  .route("/:id")
  .get(asyncWrapper(campCRUD.viewEachCamp)) //View each Campground Route
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    asyncWrapper(campCRUD.updateCamp)
  ) //Updating Campground Route
  .delete(isLoggedIn, isAuthor, asyncWrapper(campCRUD.deleteCamp)); //Delete Campground Route

//Viewing Edit Campground Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  asyncWrapper(campCRUD.getEditCampground)
);

module.exports = router;
