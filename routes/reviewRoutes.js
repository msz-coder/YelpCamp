const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utils/asyncWrapper");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middlewares");
const reviewCRUD = require("../controllers/reviews");

//Leave Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrapper(reviewCRUD.postReview)
);

//Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrapper(reviewCRUD.deleteReview)
);

module.exports = router;
