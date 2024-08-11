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
    workplace: workplace,
  });
};

exports.getStatistics = async function (req, res) {
  try {
    const statistics = await connectionPromise(
      `SELECT 
        SUM(CASE WHEN role = 'candidate' THEN 1 ELSE 0 END) as candidate_count,
        SUM(CASE WHEN role = 'business' THEN 1 ELSE 0 END) as business_count
      FROM 
        users;`
    );

    const candidateCount = statistics[0].candidate_count;
    const businessCount = statistics[0].business_count;

    res.json({
      candidate_count: candidateCount,
      business_count: businessCount
    });
  } catch (error) {
    console.error('Failed to get statistics:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

