const express = require("express");
const successfulRegController = require("../controllers/successfulRegController.js");
const successfulRegRouter = express.Router();

successfulRegRouter.get("/", successfulRegController.thanks);

module.exports = successfulRegRouter;