require("dotenv").config(); //This is for the .env file to work properly with the process.env variables
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Todo = require("./models/todayTask");
const Category = require("./models/category");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todos");

const mongoUrl = process.env.MONGO_URI;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB Atlas Connection Open");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error");
    console.log(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

const { validateTodo } = require("./utils/middleware");

app.get("/", (req, res) => {
  res.redirect("/todos");
});

app.get("/todos", async (req, res) => {
  const todayTasks = await Todo.find({}).populate("category");
  const categories = await Category.find({});
  res.render("todos/index", { todayTasks, categories });
});

app.use("/todos", todoRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
