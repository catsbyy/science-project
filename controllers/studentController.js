const app = require("../app.js");

exports.students = async function (request, response) {
  const sqlRegions = "SELECT * FROM region";
  const regions = await connection(sqlRegions, "");
  const sqlTechAndTools = "SELECT * FROM technologies_and_tools";
  const techAndTools = await connection(sqlTechAndTools, "");
};

exports.postStudents = async function (request, response) {
  // response.send(
  //    `${request.body.studentName}, ${request.body.studentSurname}, ${request.body.studentPatronymic},
  //     ${request.body.studentDateOfBirth}, ${request.body.studentMobNumber}, ${request.body.studentEmail},
  //     ${request.body.studentRegion}, ${request.body.studentCity}, ${request.body.studentStreet},
  //     ${request.body.studentHouseNum}, ${request.body.studentLinkedin}, ${request.body.studentGithub},
  //     ${request.body.studentEducation}, ${request.body.studentUniversity}, ${request.body.studentSpecialty},
  //     ${request.body.studentTechAndTools}, ${request.body.studentEnglish}, ${request.body.studentSummary},
  //     ${request.body.studentPosition}, ${request.body.studentWorkExp}, ${request.body.studentWorkArea},
  //     ${request.body.studentSalary}, ${request.body.studentWorkplace}, ${request.body.studentProfilePic}`);

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

  //const sql = "INSERT INTO student_details(name, surname, patronymic, date_of_birth, summary, profile_picture, region_id, city, street, house_number, mobile_number, email, linkedin, github, education_level_id, university, specialty, english_level_id, position_id, work_experience_id, work_area_id, salary_id, workplace_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const sql =
    "INSERT INTO student_details(name, surname, patronymic, date_of_birth, summary, profile_picture, region_id, city, street, house_number, mobile_number, email, linkedin, github, education_level_id, university, specialty, english_level_id, position_id, work_experience_id, work_area_id, salary_id, workplace_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

  await app.connection(sql, student);
  //set @lastId = SCOPE_IDENTITY(); INSERT INTO student_technology_tool(student_id, technology_tool_id) VALUES (@lastId, ?);

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

exports.successfulRegistration = function (request, resoinse) {
  response.render("successful_registration.hbs");
};

// отримання усіх кандидатів
// connection.query("SELECT * FROM student_details", function (err, results, fields) {
//     console.log(err);
//     console.log(results); // самі дані
//     //console.log(fields);  мета-дані полів
//   });
