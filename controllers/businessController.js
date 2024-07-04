const connection = require("../app.js").connection;
const db = require("../models/db.js");
const filter = require("../models/filter.js");
const dbHelper = new db();
const filterHelper = new filter();

exports.getResults = async function (req, res) {
  const candidates = await filterHelper.getResultsByFilters(req.query);
 
  res.json({
    candidates: candidates,
  });
};

exports.getCandidateDetails = async function (req, res){
  const { id, isByUserId } = req.params;
  const candidate = await connection(dbHelper.getSqlOneCandidate(id, isByUserId), "");
  
  res.json({
    candidate: candidate,
  });
};