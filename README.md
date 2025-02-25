# ToDoApp

# Overview

This is a simple To-Do application built with Node.js and Express.
It allows users to create, manage, and categorize tasks efficiently.

# Features

- Add, edit, and delete tasks
- Categorize tasks and add new categories
- Mark tasks as completed or incomplete
- View tasks by category
- User-friendly interface

# Technologies Used

Backend: Node.js, Express
Database: MongoDB (Mongoose)
Templating Engine: EJS
Frontend: Bootstrap, JavaScript
Middleware & Utilities: Joi (validation), ExpressError (custom error handling)

# Installation

# Prerequisites

Ensure you have the following installed:

Node.js (latest stable version)
MongoDB (local or cloud-based)
Git

# Steps to Run Locally

Clone the repository:
git clone https://github.com/WataTechJP/ToDoApp.git
Navigate to the project directory:
cd ToDoApp
Install dependencies:
npm install
Set up environment variables:
Create a .env file in the root directory.
Add the following variables:
MONGO_URI=your_mongodb_connection_string
Start the application:
npm start
Open your browser and go to:
http://localhost:3000/todos

# Usage

Create a Task: Click on "Add Task" and fill in the details.
Edit a Task: Click on the edit button next to a task.
Delete a Task: Click on the delete button.
Toggle Completion: Click on a task to mark it as completed/incomplete.
View Tasks by Category: Click on a category to filter tasks.

# Folder Structure

ToDoApp/
│── models/
│ ├── todayTask.js
│ ├── category.js
│── routes/
│ ├── todos.js
│── views/
│ ├── todos/
│ │ ├── index.ejs
│ │ ├── show.ejs
│ │ ├── new.ejs
│ │ ├── edit.ejs
│── public/
│── utils/
│── app.js
│── package.json
│── README.md

# Error Handling

Uses a custom ExpressError class.
Middleware for error handling ensures proper responses for invalid requests.
