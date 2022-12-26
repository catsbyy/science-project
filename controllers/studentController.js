const app = require("../app.js");

exports.students = async function (request, response) {
    const sqlRegions = "SELECT * FROM regions";
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

    const student = [request.body.studentName, request.body.studentSurname, request.body.studentPatronymic, request.body.studentDateOfBirth, request.body.studentSummary, request.body.studentProfilePic, request.body.studentRegion, request.body.studentCity, request.body.studentStreet,
       request.body.studentHouseNum, request.body.studentMobNumber, request.body.studentEmail, request.body.studentLinkedin, request.body.studentGithub,
       request.body.studentEducation, request.body.studentUniversity, request.body.studentSpecialty, request.body.studentEnglish,
       request.body.studentTechAndTools, request.body.studentPosition, request.body.studentWorkExp, request.body.studentWorkArea,
       request.body.studentSalary, request.body.studentWorkplace];

    const sql = "INSERT INTO student_details(name, surname, patronymic, date_of_birth, summary, profile_picture, regionId, city, street, house_number, mobile_number, email, linkedin, github, education_level, university, specialty, english_level, technologies_and_tools, position, work_experience, work_area, salary, workplace) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    await app.connection(sql, student);

    response.send('OK');
};

exports.successfulRegistration = function (request, resoinse) {
    response.render("successful_registration.hbs");
}

// отримання усіх кандидатів
// connection.query("SELECT * FROM student_details", function (err, results, fields) {
//     console.log(err);
//     console.log(results); // самі дані
//     //console.log(fields);  мета-дані полів
//   });