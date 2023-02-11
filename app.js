const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const { get } = require("./routes/studentRouter");
const PORT = process.env.PORT || 3001;
const app = express();

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

const connectionPromise = (url, data) =>
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
  const sqlRegions = "SELECT * FROM region";
  const regions = await connectionPromise(sqlRegions, "");
  const sqlTechAndTools = "SELECT * FROM technologies_and_tools";
  const techAndTools = await connectionPromise(sqlTechAndTools, "");
  res.json({
    regions: regions,
    techAndTools: techAndTools,
  });
});

app.get("/get-results", async (req, res) => {
  console.log(req.query);
  const students = await getResultsByFilters(req.query);
  //`SELECT * FROM student_details`;

  // функция возвращает готовый список студентов, поэтому удали sql запрос ниже!

  res.json({
    students: students,
  });
});

app.get("/get-student-details/:id", async (req, res) => {
  const studentSql = `SELECT * FROM student_details WHERE student_details.id = ${req.params.id}`;
  const student = await connectionPromise(studentSql, "");

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
const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const studentRouter = require("./routes/studentRouter.js");
const businessRouter = require("./routes/businessRouter.js");
const successfulRegRouter = require("./routes/successfulRegRouter.js");

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/students", studentRouter);
app.use("/successful-registration", successfulRegRouter);
app.use("/business", businessRouter);
app.use("/", homeRouter);

app.use(function (req, res, next) {
  res.status(404).send("Сторінку не знайдено");
});

const getResultsByFilters = async function (params) {
  let students = [];
  const defaultValue = await connectionPromise(`SELECT * FROM student_details`, "");
  if (Object.keys(params).length === 0) students = defaultValue;
  else {
    let techAndToolsIds = "";

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
    }

    console.log(techAndToolsIds);

    // основні параметри
    // співпадіння по посаді
    let positionMatches = await getMatchesByFilter(
      params.studentPosition,
      `SELECT id FROM student_details WHERE student_details.position_id = "${params.studentPosition}"`
    );

    // співпадіння по області роботи
    let workAreaMatches = await getMatchesByFilter(
      params.studentWorkArea,
      `SELECT id FROM student_details WHERE student_details.work_area_id = "${params.studentWorkArea}"`
    );

    // співпадіння по досвіду роботи
    let workExpMatches = await getMatchesByFilter(
      params.studentWorkExp,
      `SELECT id FROM student_details WHERE student_details.work_experience_id = "${params.studentWorkExp}"`
    );

    // співпадіння по технологіям - найголовніше
    let techAndToolsMatches = await getMatchesByFilter(techAndToolsIds, formSqlForTechAndTools(techAndToolsIds));

    // співпадіння по англійській
    let englishMatches = await getMatchesByFilter(
      params.studentEnglish,
      `SELECT id FROM student_details WHERE student_details.english_level_id = "${params.studentEnglish}"`
    );

    // співпадіння по освіті
    let educationMatches = await getMatchesByFilter(
      params.studentEducation,
      `SELECT id FROM student_details WHERE student_details.education_level_id = "${params.studentEducation}"`
    );

    // додаткові параметри
    // співпадіння по області
    let regionMatches = await getMatchesByFilter(
      params.studentRegion,
      `SELECT id FROM student_details WHERE student_details.region_id = "${params.studentRegion}"`
    );

    // співпадіння по місту
    let cityMatches = await getMatchesByFilter(
      params.studentCity,
      `SELECT id FROM student_details WHERE student_details.city = "${params.studentCity}"`
    );

    // співпадіння по місцю роботи
    let workplaceMatches = await getMatchesByFilter(
      params.studentWorkplace,
      `SELECT id FROM student_details WHERE student_details.workplace_id = "${params.studentWorkplace}"`
    );

    // співпадіння по заробітній платі
    let salaryMatches = await getMatchesByFilter(
      params.studentSalary,
      `SELECT id FROM student_details WHERE student_details.salary_id = "${params.studentSalary}"`
    );

    // перетини результатів - пошук кандидатів

    /*
    let set1 = techAndToolsMatches.filter((el) => workAreaMatches.includes(el));
    let set2 = set1.filter((el) => positionMatches.includes(el));
    let set3 = set2.filter((el) => englishMatches.includes(el));
    let set4 = set3.filter((el) => workExpMatches.includes(el));
    let set5 = set4.filter((el) => educationMatches.includes(el));
    let set6 = set5.filter((el) => regionMatches.includes(el));
    let set7 = set6.filter((el) => salaryMatches.includes(el));
    let set8 = set7.filter((el) => workplaceMatches.includes(el));
    let result = set8.filter((el) => cityMatches.includes(el)); 
    */
    let result = techAndToolsMatches;

    console.log("result: " + result);

    students = await connectionPromise(`SELECT * FROM student_details WHERE student_details.id IN (${result})`, "");
  }
  return students;
};

const getMatchesByFilter = async function (filter, sql) {
  let matches = [];
  if (filter !== "" || filter !== null) matches = await connectionPromise(sql, "");
  return matches.map((a) => a.id);
};

const formSqlForTechAndTools = function (techAndToolsIds) {
  let sql = "SELECT id FROM student_details";
  techAndToolsIds.forEach((tech) => {
    if ((tech = techAndToolsIds[0])) {
      sql = `SELECT id FROM student_details WHERE student_details.technologies_and_tools LIKE '%${tech};%'`;
    } else {
      sql += `OR LIKE '%${tech};%'`;
    }
  });

  console.log("formed sql: " + sql);
  return sql;
};
