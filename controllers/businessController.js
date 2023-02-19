const connection = require("../app.js").connection;
const db = require("../models/db.js");
const dbHelper = new db();

exports.postBusiness = async function (request, response) {

  const student = [
    request.body.studentRegion,
    request.body.studentCity,
    request.body.studentEducation,
    request.body.studentEnglish,
    request.body.studentTechAndTools,
    request.body.studentPosition,
    request.body.studentWorkExp,
    request.body.studentWorkArea,
    request.body.studentSalary,
    request.body.studentWorkplace,
  ];

  console.log(await connection(dbHelper.sqlGetAllStudentDetails, student));

  response.send("OK");
};
