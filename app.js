const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
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
    return console.error("Error: " + err.message);
  } else {
    console.log("Connection to SQL server is successful");
  }
});

app.use(express.json());
const candidateRouter = require("./routes/candidateRouter.js");
const businessRouter = require("./routes/businessRouter.js");
const infoRouter = require("./routes/infoRouter.js");
const userRouter = require("./routes/userRouter.js");
app.use(express.urlencoded({ extended: true }));

app.use("/api/candidates", candidateRouter);
app.use("/api/business", businessRouter);
app.use("/api/get-meta-data", infoRouter);
app.use("/api/user", userRouter);

app.use(function (req, res, next) {
  res.status(404).send("Page is not found");
});
