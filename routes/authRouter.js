const express = require("express");
const authController = require("../controllers/authController.js");
const authRouter = express.Router();

authRouter.get("/login", authController.loginUser);

authRouter.get("/register", authController.registerUser);

module.exports = authRouter;