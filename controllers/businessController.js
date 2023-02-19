const connection = require("../app.js").connection;

exports.business = async function (request, response) {
    const sqlTechAndTools = "SELECT * FROM technologies_and_tools";
    const techAndTools = await connection(sqlTechAndTools, "");
    console.log(techAndTools);
  //response.render("business.hbs", {regions, techAndTools});
};

exports.postBusiness = async function (request, response) {
//   response.send(
//     `${request.body.studentRegion}, ${request.body.studentCity},
//         ${request.body.studentEducation}, ${request.body.studentTechAndTools}, ${request.body.studentEnglish}, 
//         ${request.body.studentSummary}, ${request.body.studentPosition}, ${request.body.studentWorkExp}, 
//         ${request.body.studentWorkArea}, ${request.body.studentSalary}, ${request.body.studentWorkplace}`
//   );

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

  const sql = "SELECT * FROM student_details";
  //const sql =
  // "INSERT INTO student_details(name, surname, patronymic, date_of_birth, summary, profile_picture, region, city, street, house_number, mobile_number, email, linkedin, github, education_level, university, specialty, english_level, technologies_and_tools, position, work_experience, work_area, salary, workplace) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  console.log(await connection(sql, student));

  response.send("OK");
};
