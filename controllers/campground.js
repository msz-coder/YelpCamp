const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.viewCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.postCampground = async (req, res, next) => {
  const newCampground = new Campground(req.body.campground);
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
    originalname: f.originalname,
  }));

  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash("success", "Successfully created a new Campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.viewEachCamp = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Sorry, cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground, title: campground.title });
};

module.exports.getEditCampground = async (req, res) => {
  const { id } = req.params;
  const foundCampground = await Campground.findById(id);
  if (!foundCampground) {
    req.flash("error", "Sorry, cannot find that campground");
    return res.redirect("/campgrounds");
  }
  const imgArr = [];
  foundCampground.images.forEach((img, i) => {
    imgArr.push(img.originalname);
  });
  console.log(imgArr);
  res.render("campgrounds/edit", { foundCampground, imgArr });
};

module.exports.updateCamp = async (req, res) => {
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
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
    originalname: f.originalname,
  }));
  updatedCampground.images.push(...imgs);
  await updatedCampground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCampground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Successfully updated the Campground");
  res.redirect(`/campgrounds/${updatedCampground._id}`);
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the Campground");
  res.redirect("/campgrounds");
};
