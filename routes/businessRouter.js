const express = require("express");
const businessController = require("../controllers/businessController.js");
const businessRouter = express.Router();

businessRouter.get("/get-results", businessController.getResults);

businessRouter.get("/get-candidate-details/:id/:isByUserId?", businessController.getCandidateDetails);

businessRouter.post("/favorites", businessController.addToFavorites);

businessRouter.delete("/favorites", businessController.removeFromFavorites);

businessRouter.get('/favorites/:businessUserId', businessController.getFavorites);
  
module.exports = businessRouter;
