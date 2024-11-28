const express = require("express");

const { signup, login } = require("../../controllers/auth");
const { checkUser } = require("../../middlewares/checkUser");

const userRouter = express.Router();

// Signup route
userRouter.post("/signup", signup);

// Login route
userRouter.post("/login", login);

// Get User detail
userRouter.get("/user",checkUser,((req,res)=>{
    const userDetail = req.body; 
    return res.json({success:true,data:userDetail})
}));

module.exports = { userRouter };
