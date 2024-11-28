const { z } = require("zod");
const jwt = require("jsonwebtoken");
const {User} = require("../db/model");
const bcrypt = require("bcrypt");

require("dotenv").config();
const saltRounds = 10;

const signupData = z.object({
  name: z.string().min(3, { msg: "Minimum 3 characters needed" }),
  email: z.string().email().min(1, { msg: "Invalid email" }),
  password: z.string().min(6, { msg: "Minimum 6 characters needed" }),
});
const loginData = z.object({
  email: z.string().email().min(1, { msg: "Invalid email" }),
  password: z.string().min(6, { msg: "Minimum 6 characters needed" }),
});

async function signup(req, res) {
  const body = req.body;
  const userData = body;
  try {
    const response = signupData.parse(userData);
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, msg: "Invalid Credentials" });
  }

  try {
    // Creating token for authentication on every request.
    const token = jwt.sign(
      { name: body.name, email: body.email },
      process.env.SECRET_KEY
    );
    // Hashing the password
    const hashPassword = await bcrypt.hash(body.password, saltRounds);

    // Checking if email exists in DB
    const checkEmail = await User.findOne({ email: body.email });
    if (checkEmail) {
      console.log("Email is already in use.");
      return res
        .status(400)
        .json({ success: false, msg: "Email is already in use." });
    }

    // Posting data to DB
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: hashPassword,
    });

    return res.json({
      success: true,
      msg: "Account created successfully.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
async function login(req, res) {
  const { email, password } = req.body;
  const userData = { email, password };
  const { success } = loginData.parse(userData);
  if (!success) {
    return res.status(401).json({ success, msg: "Invalid Credentials" });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email: body.email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res
        .status(400)
        .json({ success: false, msg: "Password does not match" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.SECRET_KEY
    );

    console.log("Login successful");
    return res.json({ success: true, msg: "Login successful.", token });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
module.exports = { signup, login };
