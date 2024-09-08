const app = require("../app.js");
const dbHelper = require("../models/db.js");
const candidateObj = require("../models/candidate.js");

exports.postCandidates = async function (request, response) {
  const candidate = new candidateObj(request);
  const candidateValues = Object.values(candidate);

  try {
    await app.connection(dbHelper.sqlInsertCandidateDetails, candidateValues);

    let techAndToolsSql = "INSERT INTO candidate_technology_tool(candidate_id, technology_tool_id) VALUES ";
    const techTools = request.body.candidateTechAndTools.map(tech => `(LAST_INSERT_ID(), ${tech})`).join(", ");
    
    techAndToolsSql += `${techTools};`;

    await app.connection(techAndToolsSql, []);
    response.status(201).send("Candidate successfully created");
  } catch (error) {
    console.error("Error inserting candidate:", error);
    response.status(500).json({ error: "Failed to create candidate" });
  }
};
