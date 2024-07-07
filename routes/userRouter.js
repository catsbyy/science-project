const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.put("/update-user-details/:id", userController.updateUserDetails);

module.exports = userRouter;