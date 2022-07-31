const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");

const app = express();

const Campground = require("./models/campground");

main()
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => console.log("CONNECTION ERROR", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
}

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
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//Create new Campground Route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//Posting new Campground Details Route
app.post("/campgrounds", async (req, res) => {
  const newCampground = new Campground(req.body.campground);
  console.log(newCampground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});
//View each Campground Route
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  console.log(campground);
  res.render("campgrounds/show", { campground, title: campground.title });
});

//Viewing Edit Campground Route
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const foundCampground = await Campground.findById(id);
  res.render("campgrounds/edit", { foundCampground });
});

//Updating Campground Route
app.put("/campgrounds/:id", async (req, res) => {
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
});

//Delete Campground Route
app.delete("/campground/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("Serving on Port 3000");
});
