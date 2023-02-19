const app = require("../app.js");
const db = require("../models/db.js");
const dbHelper = new db();

exports.postStudents = async function (request, response) {
  const student = [
    request.body.studentName,
    request.body.studentSurname,
    request.body.studentPatronymic,
    request.body.studentDateOfBirth,
    request.body.studentSummary,
    request.body.studentProfilePic,
    request.body.studentRegion,
    request.body.studentCity,
    request.body.studentStreet,
    request.body.studentHouseNum,
    request.body.studentMobNumber,
    request.body.studentEmail,
    request.body.studentLinkedin,
    request.body.studentGithub,
    request.body.studentEducation,
    request.body.studentUniversity,
    request.body.studentSpecialty,
    request.body.studentEnglish,
    request.body.studentPosition,
    request.body.studentWorkExp,
    request.body.studentWorkArea,
    request.body.studentSalary,
    request.body.studentWorkplace,
    request.body.studentTechAndTools,
  ];

  await app.connection(dbHelper.sqlInsertStudentDetails, student);

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

