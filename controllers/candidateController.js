const app = require("../app.js");
const db = require("../models/db.js");
const dbHelper = new db();
const candidateObj = require("../models/candidate.js");

exports.postCandidates = async function (request, response) {
  const candidate = new candidateObj(request);

  await app.connection(dbHelper.sqlInsertCandidateDetails, Object.values(candidate));

  techAndToolsSql = "";
  request.body.candidateTechAndTools.forEach((tech, index) => {
    if (index == 0) {
      techAndToolsSql += `INSERT INTO candidate_technology_tool(candidate_id, technology_tool_id) VALUES (LAST_INSERT_ID(), ${tech})`;
    } else if (index == request.body.candidateTechAndTools.length - 1 && index != 0) {
      techAndToolsSql += `,(LAST_INSERT_ID(), ${tech});`;
    } else {
      techAndToolsSql += `,(LAST_INSERT_ID(), ${tech})`;
    }
  });
  await app.connection(techAndToolsSql, "");

  response.send("OK");
};


