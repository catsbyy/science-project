const connectionPromise = require("../app.js").connection;
const db = require("../models/db.js");
const dbHelper = new db();

exports.getRegionsAndTechs = async function (req, res) {
  const regions = await connectionPromise(dbHelper.sqlGetAllRegions, "");
  const techAndTools = await connectionPromise(dbHelper.sqlGetAllTechAndTools, "");
  res.json({
    regions: regions,
    techAndTools: techAndTools,
  });
};

