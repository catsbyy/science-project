const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.get("/login", userController.loginUser);

userRouter.get("/register", userController.registerUser);

module.exports = userRouter;