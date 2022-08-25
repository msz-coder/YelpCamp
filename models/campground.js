const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema(
  {
    title: String,
    cloudinaryImages: [
      {
        url: String,
        filename: String,
        originalname: String,
      },
    ],
    linkImages: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup", {
  ref: "Review",
  localField: "_id",
  foreignField: "rating",
  justOne: true,
}).get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp.reviews.length) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
