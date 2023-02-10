const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const { get } = require("./routes/studentRouter");
const PORT = process.env.PORT || 3001;
const app = express();
//app.use(express.static("public"));

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
  let studentsSql = `SELECT * FROM student_details`;
  //getResultsByFilters(req.query);
  // функция возвращает готовый список студентов, поэтому удали sql запрос ниже!

  console.log(studentsSql);
  const students = await connectionPromise(studentsSql, "");
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

// отримання усіх кандидатів
// connection.query("SELECT * FROM student_details", function (err, results, fields) {
//   console.log(err);
//   console.log(results); // самі дані
//   //console.log(fields);  мета-дані полів
// });

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
  let studentsSql = "";
  if (Object.keys(params).length === 0) studentsSql = `SELECT * FROM student_details`;
  else {
    //studentsSql = formSql(params);
    const techAndToolsIds = params.studentTechAndTools
      .split(";")
      .filter(function (el) {
        return el != "";
      })
      .map(Number);

    // співпадіння по посаді
    let positionMatches;
    if (params.studentPosition !== "" || params.studentPosition !== null)
      positionMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.position_id = "${params.studentPosition}"`,
        ""
      );

    // співпадіння по області роботи
    let workAreaMatches;
    if (params.studentWorkArea !== "" || params.studentWorkArea !== null)
      workAreaMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.work_area_id = "${params.studentWorkArea}"`,
        ""
      );
    // співпадіння по досвіду роботи
    let workExpMatches;
    if (params.studentWorkExp !== "" || params.studentWorkExp !== null)
      workExpMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.work_experience_id = "${params.studentWorkExp}"`,
        ""
      );
    // співпадіння по технологіям
    let techAndToolsMatches;
    if (params.techAndToolsIds !== "" || params.techAndToolsIds !== null)
      techAndToolsMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.technologies_and_tools = "${params.techAndToolsIds}"`,
        ""
      );
    // співпадіння по англійській
    let englishMatches;
    if (params.studentEnglish !== "" || params.studentEnglish !== null)
      englishMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.english_level_id = "${params.studentEnglish}"`,
        ""
      );
    // співпадіння по освіті
    let educationMatches;
    if (params.studentEducation !== "" || params.studentEducation !== null)
      educationMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.education_level_id = "${params.studentEducation}"`,
        ""
      );
    // співпадіння по області
    let regionMatches;
    if (params.studentRegion !== "" || params.studentRegion !== null)
      regionMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.region_id = "${params.studentRegion}"`,
        ""
      );
    // співпадіння по місту
    let cityMatches;
    if (params.studentCity !== "" || params.studentCity !== null)
      cityMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.city = "${params.studentCity}"`,
        ""
      );
    // співпадіння по місцю роботи
    let workplaceMatches;
    if (params.studentWorkplace !== "" || params.studentWorkplace !== null)
      workplaceMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.workplace_id = "${params.studentWorkplace}"`,
        ""
      );
    // співпадіння по заробітній платі
    let salaryMatches;
    if (params.studentSalary !== "" || params.studentSalary !== null)
      salaryMatches = await connectionPromise(
        `SELECT * FROM student_details WHERE student_details.salary_id = "${params.studentSalary}"`,
        ""
      );

    //`SELECT * FROM student_details WHERE student_details.position = "${params.studentPosition}"`;
  }
  //studentRegion
  //studentCity
  //studentEducation
  //studentSalary
  //studentWorkplace

  //studentTechAndTools
  //studentEnglish
  //studentWorkExp
  //studentPosition
  //studentWorkArea
  return studentSql;
};
