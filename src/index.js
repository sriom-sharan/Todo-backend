const express = require("express");
const cors = require("cors");
const { userRouter } = require("./db/routes/userRoutes");
const { taskRoutes } = require("./db/routes/taskRoutes");
const connectDB = require("./db/db");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Define routes and middleware
app.use("/api/v1/auth/", userRouter);
app.use("/api/v1/", taskRoutes);

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
main();
