const connectionPromise = require("../app.js").connection;
const db = require("../models/db.js");
const dbHelper = new db();

exports.getRegionsAndTechs = async function (req, res) {
  const regions = await connectionPromise(dbHelper.sqlGetAllRegions, "");
  const techAndTools = await connectionPromise(dbHelper.sqlGetAllTechAndTools, "");
  const english = await connectionPromise(dbHelper.sqlGetAllEnglishLevels, "");
  const education = await connectionPromise(dbHelper.sqlGetAllEducationLevels, "");
  const position = await connectionPromise(dbHelper.sqlGetAllPositions, "");
  const salary = await connectionPromise(dbHelper.sqlGetAllSalaries, "");
  const workArea = await connectionPromise(dbHelper.sqlGetAllWorkAreas, "");
  const workExp = await connectionPromise(dbHelper.sqlGetAllWorkExps, "");
  const workplace = await connectionPromise(dbHelper.sqlGetAllWorkplaces, "");
  res.json({
    regions: regions,
    techAndTools: techAndTools,
    english: english,
    education: education,
    position: position,
    salary: salary,
    workArea: workArea,
    workExp: workExp,
    workplace: workplace
  });
};

