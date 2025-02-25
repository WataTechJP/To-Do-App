const express = require("express");
const router = express.Router();
const Todo = require("../models/todayTask");
const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { validateTodo, validateCategory } = require("../utils/middleware");
const todoRoutes = require("./todos");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const todayTasks = await Todo.find({}).populate({
      path: "category",
      select: "name",
    });
    const categories = await Category.find({});
    res.render("todos/index", { todayTasks, categories });
  })
);

router.get(
  "/new",
  catchAsync(async (req, res) => {
    const categories = await Category.find({});
    res.render("todos/new", { categories });
  })
);

router.get(
  "/categoryList",
  catchAsync(async (req, res) => {
    const todayTasks = await Todo.find({}).populate({
      path: "category",
      select: "name",
    });
    const categories = await Category.find({});
    res.render("todos/categoryList", { todayTasks, categories });
  })
);

router.get(
  "/addCate",
  catchAsync(async (req, res) => {
    const categories = await Category.find({});
    res.render("todos/addCate", { categories });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const task = await Todo.findById(req.params.id);
    const categories = await Category.find({});
    res.render("todos/edit", { task, categories });
  })
);

router.get(
  "/:id/show",
  catchAsync(async (req, res) => {
    const todo = await Todo.findById(req.params.id).populate("category");
    res.render("todos/show", { todo });
  })
);

router.get(
  "/:id",
  validateTodo,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id).populate("category");
    res.render("todos/show", { todo });
  })
);

router.get(
  "/categories",
  catchAsync(async (req, res) => {
    const categories = await Category.find({});
    res.render("todos/new", { categories });
  })
);

router.post(
  "/categories",
  validateCategory,
  catchAsync(async (req, res) => {
    const { name } = req.body;
    try {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.send(`
        <html>
          <head>
            <meta http-equiv="refresh" content="5;url=/todos/new">
          </head>
          <body>
            <p>This category already exists. Back to in 5 seconds...</p>
          </body>
        </html>
      `);
      }

      const category = new Category({ name });
      await category.save();
      res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="5;url=/todos/new">
        </head>
        <body>
          <p>Category created successfully. Back to in 5 seconds...</p>
        </body>
      </html>
    `);
    } catch (error) {
      console.error("Error saving category:", error);
      res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=/todos/new">
        </head>
        <body>
          <p>Error saving category. Redirecting in 3 seconds...</p>
        </body>
      </html>
    `);
    }
  })
);

router.post(
  "/:id/toggle",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await Todo.findById(id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json({ success: true, completed: task.completed });
  })
);

router.post(
  "/",
  validateTodo,
  catchAsync(async (req, res) => {
    const { title, category, dueDay, description } = req.body.todo;

    const foundCategory = await Category.findById(category);

    if (!foundCategory) {
      return res.status(400).send("Invalid Category Selected");
    }

    const todo = new Todo({
      title,
      category: foundCategory._id,
      dueDay,
      description,
      completed: false,
    });

    await todo.save();
    res.redirect("/todos");
  })
);

router.put(
  "/:id/complete",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { completed = false } = req.body;
    await Todo.findByIdAndUpdate(id, { completed });
    res.status(200).json({ message: "Task status updated" });
  })
);

router.put(
  "/:id",
  validateTodo,
  validateCategory,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log("Received request body:", req.body);

    const { title, category, dueDay, description, completed } = req.body.todo;

    console.log("Received category:", category);

    if (!category) {
      console.log("Category is empty!");
      return res.status(400).send("Category is required");
    }

    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      console.log("Category ID not found in DB!");
      return res.status(400).send("Invalid Category Selected");
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        category: foundCategory._id,
        dueDay,
        description,
        completed,
      },
      { new: true }
    );

    res.redirect(`/todos/${todo._id}/show`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    await Category.findByIdAndDelete(id);
    res.redirect("/todos");
  })
);

module.exports = router;
