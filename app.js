const mysql = require("mysql");
const express = require("express");
const cors = require('cors');
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

const connectionPromise = (url, data) =>  new Promise((resolve, reject) => {
  connection.query(url, data, function (err, results, fields) {
      if(err) {
        reject(err);
      return;
    }
    resolve(results)
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

app.get('/server', async (req, res) => {
  const sqlRegions = "SELECT * FROM regions";
  const regions = await connectionPromise(sqlRegions, "");
  const sqlTechAndTools = "SELECT * FROM technologies_and_tools";
  const techAndTools =  await connectionPromise(sqlTechAndTools, "");
  res.json({
    regions: regions,
    techAndTools: techAndTools
  })
});

app.get('/get-results', async (req, res) => {
  const studentsSql = "SELECT * FROM student_details";
  const students = await connectionPromise(studentsSql, "");
  res.json({
    students: students
  })
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


