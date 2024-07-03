const express = require("express");
const authController = require("../controllers/authController.js");
const authRouter = express.Router();
const authenticateToken = require("../app.js").authenticateToken;

authRouter.post("/login", authController.loginUser);

authRouter.post("/register", authController.registerUser);

authRouter.get("/me", authenticateToken, authController.checkUser);

module.exports = authRouter;