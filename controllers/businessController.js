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

exports.getCandidateDetails = async function (req, res) {
  const { id, isByUserId } = req.params;
  const candidate = await connection(dbHelper.getSqlOneCandidate(id, isByUserId), "");

  res.json({
    candidate: candidate,
  });
};

exports.addToFavorites = async (req, res) => {
  const { businessUserId, candidateId } = req.body;

  try {
    const result = await connection("INSERT INTO favorites (business_user_id, candidate_id) VALUES (?, ?)", [
      businessUserId,
      candidateId,
    ]);
    res.json({ success: true, message: "Candidate added to favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add candidate to favorites", error });
  }
};

exports.removeFromFavorites = async function (req, res) {
  const { businessUserId, candidateId } = req.body;

  try {
    const result = await connection("DELETE FROM favorites WHERE business_user_id = ? AND candidate_id = ?", [
      businessUserId,
      candidateId,
    ]);

    res.json({ success: true, message: "Candidate removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add candidate to favorites", error });
  }
};

exports.getFavorites = async function (req, res) {
  const { businessUserId } = req.params;
  const fetchAllDetails = req.query.fetchAllDetails || "false";

  let favorites;

  let candidates;

  try {
    if (fetchAllDetails === "true") {
      favorites = await connection("SELECT * FROM favorites WHERE business_user_id = ?", [businessUserId]);

      const candidateIds = favorites.map(fav => fav.candidate_id).join(',');

      const candidates = await connection(dbHelper.getSqlMultipleCandidates(candidateIds));
      res.json({ success: true, favorites: favorites, candidates: candidates });
    } else {
      favorites = await connection("SELECT * FROM favorites WHERE business_user_id = ?", [businessUserId]);
      res.json({ success: true, favorites: favorites });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch favorites", error });
  }
};
