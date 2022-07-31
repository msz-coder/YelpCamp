const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const { seedImg } = require("./imgSeeder");
const Campground = require("../models/campground");

main()
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => console.log("CONNECTION ERROR", err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: await seedImg(),
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!",
      price,
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
