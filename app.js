const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const asyncWrapper = require("./utils/asyncWrapper");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");

const app = express();

main()
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => console.log("CONNECTION ERROR", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
}

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// use ejs-locals for all ejs templates:
app.engine("ejs", engine);

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Homepage route
app.get("/", (req, res) => {
  res.render("home");
});

//View All Campgrounds Route
app.get(
  "/campgrounds",
  asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Create new Campground Route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//Posting new Campground Details Route
app.post(
  "/campgrounds",
  validateCampground,
  asyncWrapper(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
//View each Campground Route
app.get(
  "/campgrounds/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground, title: campground.title });
  })
);

//Viewing Edit Campground Route
app.get(
  "/campgrounds/:id/edit",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    res.render("campgrounds/edit", { foundCampground });
  })
);

//Updating Campground Route
app.put(
  "/campgrounds/:id",
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
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  })
);

//Delete Campground Route
app.delete(
  "/campgrounds/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

//Leave Review
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Delete Review
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

//All invalid routes (All request types)
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on Port 3000");
});
