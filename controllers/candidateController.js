const app = require("../app.js");
const db = require("../models/db.js");
const dbHelper = new db();
const candidateObj = require("../models/candidate.js");

exports.postCandidates = async function (request, response) {
  const candidate = new candidateObj(request);
  const candidateId = request.body.candidateId;
  const { candidateTechAndTools, ...candidateDetails } = candidate;

  try {
    if (candidateId) {
      const values = [...Object.values(candidateDetails), candidateId]; 
      await app.connection(dbHelper.sqlUpdateCandidateDetails, values);

      await app.connection(dbHelper.sqlDeleteTechTools, [candidateId]);

      if (candidateTechAndTools && candidateTechAndTools.length > 0) {
        let techAndToolsSql = "INSERT INTO candidate_technology_tool(candidate_id, technology_tool_id) VALUES ";
        const techTools = candidateTechAndTools.map(tech => `(${candidateId}, ${tech})`).join(", ");
        techAndToolsSql += `${techTools};`;

        await app.connection(techAndToolsSql, "");
      }

      response.status(200).send("Candidate successfully updated");
    } else {
      await app.connection(dbHelper.sqlInsertCandidateDetails, Object.values(candidateDetails));

      let techAndToolsSql = "INSERT INTO candidate_technology_tool(candidate_id, technology_tool_id) VALUES ";
      const techTools = request.body.candidateTechAndTools.map(tech => `(LAST_INSERT_ID(), ${tech})`).join(", ");
      techAndToolsSql += `${techTools};`;

      await app.connection(techAndToolsSql, "");
      response.status(201).send("Candidate successfully created");
    }
  } catch (error) {
    console.error("Error inserting/updating candidate:", error);
    response.status(500).json({ error: "Failed to save candidate" });
  }
};