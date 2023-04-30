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

// підключення
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
  const students = await getResultsByFilters(req.query);

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

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.status(404).send("Сторінку не знайдено");
});

const getResultsByFilters = async function (params) {
  let students = [];
  console.log("tak, eto shto takoe?" + params);
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
          return el !== "";
        })
        .map(Number);
    }

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
      dbHelper.getSqlStudentIdsByWorkExp(params.studentWorkExp)
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

    let resultsObj = {
      techAndTools: techAndToolsMatches,
      workArea: workAreaMatches,
      position: positionMatches,
      english: englishMatches,
      workExp: workExpMatches,
      education: educationMatches,
      salary: salaryMatches,
      region: regionMatches,
      workplace: workplaceMatches,
      city: cityMatches
    };

    for (const [key, value] of Object.entries(resultsObj)) {
      console.log(`RESULTOBJ: ${key}: ${value}`);
    }

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

    let set1 = getMatchesIntersection(techAndToolsMatches, workAreaMatches);
    let set2 = getMatchesIntersection(set1, positionMatches);
    let set3 = getMatchesIntersection(set2, englishMatches);
    let set4 = getMatchesIntersection(set3, workExpMatches);
    let set5 = getMatchesIntersection(set4, educationMatches);
    let set6 = getMatchesIntersection(set5, regionMatches);
    let set7 = getMatchesIntersection(set6, salaryMatches);
    let set8 = getMatchesIntersection(set7, workplaceMatches);
    let result = getMatchesIntersection(set8, cityMatches);

    console.log("result: " + result);

    if (result.length) {
      result = result;
    } else {
      result = [...new Set([...result, ...set1])];
    }

    console.log("result + set1: " + result);

    students =
      result.length !== 0 ? await connectionPromise(dbHelper.getSqlMultipleStudents(result), "") : defaultValue;
  }
  return students;
};

const getMatchesByFilter = async function (filter, sql) {
  console.log("filter: " + filter);
  console.log("sql: " + sql);
  let matches = [];
  if (filter === "" || filter === null || filter === undefined) {
    return matches;
  } else {
    matches = await connectionPromise(sql, "");
    return sql.includes("student_technology_tool") ? matches.map((a) => a.student_id) : matches.map((a) => a.id);
  }
  //console.log(sql + ": " + matches.map((a) => a.id));
  //if (sql.includes("student_technology_tool")) console.log("special for tools: " + matches.map((a) => a.student_id));
};

const getMatchesIntersection = function (a, b) {
  return a.filter((el) => b.includes(el));
};
