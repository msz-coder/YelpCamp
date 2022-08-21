const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
      originalname: String,
    },
  ],
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
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp.reviews.length) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
