const express = require("express");
const businessController = require("../controllers/businessController.js");
const businessRouter = express.Router();
 
businessRouter.get("/", businessController.business);

businessRouter.post("/", businessController.postBusiness);
 
module.exports = businessRouter;