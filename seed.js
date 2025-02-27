require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/category");

const mongoUrl = process.env.MONGO_URI;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas Connection Open");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error");
    console.log(err);
  });

const seedCategories = [
  { name: "No Category" },
  { name: "Work" },
  { name: "Personal" },
  { name: "Shopping" },
  { name: "Health" },
  { name: "Study" },
];

const seedDB = async () => {
  await Category.deleteMany({});
  await Category.insertMany(seedCategories);
  console.log("Default Categories Added!");
};

seedDB().then(() => {
  mongoose.connection.close();
});
