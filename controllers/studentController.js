const app = require("../app.js");
const db = require("../models/db.js");
const dbHelper = new db();
const studentObj = require("../models/student.js");

exports.postStudents = async function (request, response) {
  const student = new studentObj(request);

  await app.connection(dbHelper.sqlInsertStudentDetails, Object.values(student));

  const techAndToolsIds = request.body.studentTechAndTools
    .split(";")
    .filter(function (el) {
      return el != "";
    })
    .map(Number);

  techAndToolsSql = "";
  techAndToolsIds.forEach((tech, index) => {
    if (index == 0) {
      techAndToolsSql += `INSERT INTO student_technology_tool(student_id, technology_tool_id) VALUES (LAST_INSERT_ID(), ${tech})`;
    } else if (index == techAndToolsIds.length - 1 && index != 0) {
      techAndToolsSql += `,(LAST_INSERT_ID(), ${tech});`;
    } else {
      techAndToolsSql += `,(LAST_INSERT_ID(), ${tech})`;
    }
  });
  await app.connection(techAndToolsSql, "");

  response.send("OK");
};

