const express = require("express");
const studentController = require("../controllers/studentController.js");
const studentRouter = express.Router();

studentRouter.post("/", studentController.postStudents);

module.exports = studentRouter;