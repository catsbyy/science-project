const express = require("express");
const businessController = require("../controllers/businessController.js");
const businessRouter = express.Router();

businessRouter.get("/get-results", businessController.getResults);

businessRouter.get("/get-candidate-details/:id/:isByUserId?", businessController.getCandidateDetails);

module.exports = businessRouter;