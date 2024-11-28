const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { client } = require("../db/db");
const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};
const Status = {
  COMPLETED: "completed",
  PENDING: "pending",
};
const validateEmail = (email) => {
  const re = /^[\w-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

const taskSchema = new mongoose.Schema({
  title: { type: String, required: "Title is required" },
  status: { type: String, enum: Object.values(Status),default:"pending" },
  description: { type: String, required: "Description is required" },
  dueDate: { type: Date, required: "Due date is required", },
  priority: { type: String, enum: Object.values(Priority) },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
  },
  password: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

// Export Models
const Task = mongoose.model("Task", taskSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Task, User, taskSchema, userSchema };
