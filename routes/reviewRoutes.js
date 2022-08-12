const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utils/asyncWrapper");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middlewares");

//Leave Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
