const express = require("express");
const candidateController = require("../controllers/candidateController.js");
const candidateRouter = express.Router();

candidateRouter.post("/add-candidate", candidateController.postCandidates);

module.exports = candidateRouter;