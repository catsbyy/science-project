const connection = require("../app.js").connection;
const db = require("../models/db.js");
const filter = require("../models/filter.js");
const dbHelper = new db();
const filterHelper = new filter();

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
