const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const app = express();

const db = require("./models/db.js");
const dbHelper = new db();

console.log(dbHelper.sqlRegions);

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "scienceproject",
  password: "DifficultPassw12",
});

const connectionPromise = async (url, data) =>
  new Promise((resolve, reject) => {
    connection.query(url, data, function (err, results, fields) {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });

exports.connection = connectionPromise;

// тестування підключення
connection.connect(function (err) {
  if (err) {
    return console.error("Помилка: " + err.message);
  } else {
    console.log("Підключення до сервера MySQL успішно встановлено");
  }
});

app.get("/server", async (req, res) => {
  const regions = await connectionPromise(dbHelper.sqlGetAllRegions, "");
  const techAndTools = await connectionPromise(dbHelper.sqlGetAllTechAndTools, "");
  res.json({
    regions: regions,
    techAndTools: techAndTools,
  });
});

app.get("/get-results", async (req, res) => {
  //console.log(req.query);
  /* 
  const students = await connectionPromise(
    `SELECT student_details.*,
  (SELECT GROUP_CONCAT(student_technology_tool.technology_tool_id)
     FROM student_technology_tool
    WHERE student_technology_tool.student_id = student_details.id) AS technologies_and_tools
FROM student_details WHERE position_id = ${req.query.studentPosition}`,
    ""
  ); */
  //console.log(students);
  const students = await getResultsByFilters(req.query);
  //`SELECT * FROM student_details`;

  // функция возвращает готовый список студентов, поэтому удали sql запрос ниже!

  res.json({
    students: students,
  });
});

app.get("/get-student-details/:id", async (req, res) => {
  const student = await connectionPromise(dbHelper.getSqlOneStudent(req.params.id), "");

  res.json({
    student: student,
  });
});

// закриття підключення
// connection.end(function (err) {
//   if (err) {
//     return console.log("Помилка: " + err.message);
//   }
//   console.log("Підключення закрито");
// });

app.use(express.json());

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.status(404).send("Сторінку не знайдено");
});

const getResultsByFilters = async function (params) {
  let students = [];
  const defaultValue = await connectionPromise(dbHelper.sqlGetAllStudentDetails, "");
  if (Object.keys(params).length === 0) students = defaultValue;
  else {
    let techAndToolsIds = [];

    //console.log("techs: ", params.studentTechAndTools);
    if (
      params.studentTechAndTools !== "" &&
      params.studentTechAndTools !== null &&
      params.studentTechAndTools !== undefined
    ) {
      techAndToolsIds = params.studentTechAndTools
        .split(";")
        .filter(function (el) {
          return el != "";
        })
        .map(Number);
      //console.log("transformed techs: ", techAndToolsIds);
      //console.log("transformed techs in string: ", techAndToolsIds.toString());
    }

    //console.log(techAndToolsIds);

    // основні параметри
    // співпадіння по посаді
    let positionMatches = await getMatchesByFilter(
      params.studentPosition,
      dbHelper.getSqlStudentIdsByPosition(params.studentPosition)
    );

    // співпадіння по області роботи
    const workAreaMatches = await getMatchesByFilter(
      params.studentWorkArea,
      dbHelper.getSqlStudentIdsByWorkArea(params.studentWorkArea)
    );

    // співпадіння по досвіду роботи
    let workExpMatches = await getMatchesByFilter(
      params.studentWorkExp,
      getSqlStudentIdsByWorkExp(params.studentWorkExp)
    );

    // співпадіння по технологіям - найголовніше
    console.log("tools right before calling db: " + techAndToolsIds);
    let techAndToolsMatches = [];
    if (Array.isArray(techAndToolsIds) && techAndToolsIds.length) {
      techAndToolsMatches = await getMatchesByFilter(
        techAndToolsIds,
        dbHelper.getSqlStudentIdsByTechAndTools(techAndToolsIds.toString())
      );
    }

    // співпадіння по англійській
    let englishMatches = await getMatchesByFilter(
      params.studentEnglish,
      dbHelper.getSqlStudentIdsByEnglish(params.studentEnglish)
    );

    // співпадіння по освіті
    let educationMatches = await getMatchesByFilter(
      params.studentEducation,
      dbHelper.getSqlStudentIdsByEducation(params.studentEducation)
    );

    // додаткові параметри
    // співпадіння по області
    let regionMatches = await getMatchesByFilter(
      params.studentRegion,
      dbHelper.getSqlStudentIdsByRegion(params.studentRegion)
    );

    // співпадіння по місту
    let cityMatches = await getMatchesByFilter(params.studentCity, dbHelper.getSqlStudentIdsByCity(params.studentCity));

    // співпадіння по місцю роботи
    let workplaceSql = "";
    switch (params.studentWorkplace) {
      case "1":
      case "2":
        workplaceSql = dbHelper.getSqlStudentIdsByWorkplace(params.studentWorkplace);
      case "3":
        workplaceSql = dbHelper.sqlGetAllStudentIds;
        break;
      default:
        workplaceSql = dbHelper.sqlGetAllStudentIds;
        break;
    }
    let workplaceMatches = await getMatchesByFilter(params.studentWorkplace, workplaceSql);

    // співпадіння по заробітній платі
    let salaryMatches = await getMatchesByFilter(
      params.studentSalary,
      dbHelper.getSqlStudentIdsBySalary(params.studentSalary)
    );

    // перетини результатів - пошук кандидатів
    console.log("workArea: " + workAreaMatches);
    console.log("workExpMatches: " + workExpMatches);
    console.log("techAndToolsMatches: " + techAndToolsMatches);
    console.log("englishMatches: " + englishMatches);
    console.log("educationMatches: " + educationMatches);
    console.log("regionMatches: " + regionMatches);
    console.log("cityMatches: " + cityMatches);
    console.log("workplaceMatches: " + workplaceMatches);
    console.log("salaryMatches: " + salaryMatches);
    /*
    let set1 = techAndToolsMatches.filter((el) => positionMatches.includes(el));
    let result = set1;
     */
    let set1 = techAndToolsMatches.filter((el) => workAreaMatches.includes(el));
    let set2 = set1.filter((el) => positionMatches.includes(el));
    let set3 = set2.filter((el) => englishMatches.includes(el));
    let set4 = set3.filter((el) => workExpMatches.includes(el));
    let set5 = set4.filter((el) => educationMatches.includes(el));
    let set6 = set5.filter((el) => regionMatches.includes(el));
    let set7 = set6.filter((el) => salaryMatches.includes(el));
    let set8 = set7.filter((el) => workplaceMatches.includes(el));
    let result = set8.filter((el) => cityMatches.includes(el));

    console.log("result: " + result);

    if (result.length) {
      result = result;
    } else {
      result = [...new Set([...result, ...set1])];
    }
    students = await connectionPromise(dbHelper.getSqlMultipleStudents(result), "");
  }
  return students;
};

const getMatchesByFilter = async function (filter, sql) {
  let matches = [];
  if (filter !== "" || filter !== null || filter !== undefined) matches = await connectionPromise(sql, "");
  console.log(sql + ": " + matches.map((a) => a.id));
  if (sql.includes("student_technology_tool")) console.log("special for tools: " + matches.map((a) => a.student_id));

  return sql.includes("student_technology_tool") ? matches.map((a) => a.student_id) : matches.map((a) => a.id);
};
