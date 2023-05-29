const connection = require("../app.js").connection;
const db = require("../models/db.js");
const filter = require("../models/filter.js");
const dbHelper = new db();
const filterHelper = new filter();

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

exports.getResults = async function (req, res) {
  const students = await filterHelper.getResultsByFilters(req.query);
 
  res.json({
    students: students,
  });
};

exports.getStudentDetails = async function (req, res){
  const student = await connection(dbHelper.getSqlOneStudent(req.params.id), "");

  res.json({
    student: student,
  });
};
