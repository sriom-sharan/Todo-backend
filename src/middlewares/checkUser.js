const jwt = require("jsonwebtoken");
const {User} = require("../db/model"); // Ensure correct path to your User model
require("dotenv").config();

async function checkUser(req, res, next) {
  const headerAuth = req.headers.authorization;

  // Check if Authorization header exists
  if (!headerAuth || !headerAuth.startsWith("Bearer")) {
    return res.status(401).json({ success: false, msg: "Not authorized, no token" });
  }

  try {
    const token = headerAuth.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify token

    // Find user in database
    const userDetail = await User.findOne({ email: decoded.email });
    if (!userDetail) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    req.user = userDetail; // Attach user details to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      success: false,
      msg: "Not authorized, token failed",
      details: error.message, // Optional: include error details for debugging
    });
  }
}

module.exports = { checkUser };
