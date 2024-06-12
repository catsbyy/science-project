const express = require("express");
const candidateController = require("../controllers/candidateController.js");
const candidateRouter = express.Router();

candidateRouter.post("/", candidateController.postCandidates);

module.exports = candidateRouter;