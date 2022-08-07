const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utils/asyncWrapper");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//View All Campgrounds Route
router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Create new Campground Route
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

//Posting new Campground Details Route
router.post(
  "/",
  validateCampground,
  asyncWrapper(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Successfully created a new Campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
//View each Campground Route
router.get(
  "/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
      req.flash("error", "Sorry, cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground, title: campground.title });
  })
);

//Viewing Edit Campground Route
router.get(
  "/:id/edit",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
      req.flash("error", "Sorry, cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { foundCampground });
  })
);

//Updating Campground Route
router.put(
  "/:id",
  validateCampground,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const updatedContent = req.body.campground;
    const updatedCampground = await Campground.findByIdAndUpdate(
      id,
      updatedContent,
      {
        new: true,
        runValidators: true,
      }
    );
    req.flash("success", "Successfully updated the Campground");
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  })
);

//Delete Campground Route
router.delete(
  "/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the Campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
