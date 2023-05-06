const express = require("express");
const studentController = require("../controllers/studentController.js");
const studentRouter = express.Router();

//studentRouter.get("/", studentController.students);

studentRouter.post("/", studentController.postStudents);

module.exports = studentRouter;