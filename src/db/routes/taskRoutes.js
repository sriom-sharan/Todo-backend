const express = require("express");
const { createTask, updateTask,getAllTasks,getTaskById } = require("../../controllers/task");
const { checkUser } = require("../../middlewares/checkUser");
const taskRoutes = express.Router();

// Create a task
taskRoutes.post("/create-task", checkUser, createTask);
// Update a task
taskRoutes.put("/tasks/:id", checkUser, updateTask);
// Get Task by id
taskRoutes.get("/tasks/:taskId", checkUser, getTaskById);
// Get all Task
taskRoutes.get("/tasks", checkUser, getAllTasks);
module.exports = { taskRoutes };
