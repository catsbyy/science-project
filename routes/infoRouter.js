const express = require("express");
const infoController = require("../controllers/infoController.js");
const infoRouter = express.Router();

infoRouter.get("/", infoController.getRegionsAndTechs);

module.exports = infoRouter;