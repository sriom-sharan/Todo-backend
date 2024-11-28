const { Task, User } = require("../db/model");
const { z } = require("zod");

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
});

// Create a task
async function createTask(req, res) {
  const body = req.body;
  try {
    const response = taskSchema.parse(body);
  } catch (error) {
    console.log(error);

    return res
      .status(401)
      .json({ success: false, msg: "Invalid task details" });
  }

  try {
    const user = req.user;
    const task = await Task.create({
      title: body.title,
      description: body.description,
      priority: body.priority,
      dueDate: body.dueDate,
      creator: user._id,
    });

    return res.json({
      success: true,
      msg: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// Update a specific task
const updateTask = async (req, res) => {
  const { id } = req.params; // Get task ID from the request URL
  const updateData = req.body; // Get update data from the request body
  const userId = req.user._id;
  try {
    // Update the task by ID
    const updatedTask = await Task.findByIdAndUpdate(
      { _id: id, creator: userId },
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate fields before updating
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while updating the task",
      details: err.message,
    });
  }
};

// Get all tasks of a user
const getAllTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values for page and limit
  const userId = req.user._id; // Assuming req.user contains the authenticated user

  try {
    // Validate page and limit as integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    if (isNaN(pageInt) || isNaN(limitInt) || pageInt < 1 || limitInt < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit parameters",
      });
    }

    // Calculate the number of documents to skip
    const skip = (pageInt - 1) * limitInt;

    // Fetch tasks with pagination
    const tasks = await Task.find({ creator: userId })
      .sort({ createdAt: -1 }) // Optional: Sort tasks by creation date (descending)
      .skip(skip) // Skip documents for the current page
      .limit(limitInt); // Limit the number of documents returned

    // Get total count of tasks for the user
    const totalTasks = await Task.countDocuments({ creator: userId });

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(totalTasks / limitInt),
        totalTasks,
        pageSize: limitInt,
      },
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching tasks",
      details: err.message,
    });
  }
};


module.exports = { createTask, updateTask, getAllTasks };
