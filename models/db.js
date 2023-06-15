const englishModule = require("../public/helpers/englishLevelsList");
const workAreaModule = require("../public/helpers/workAreaOptionsList");
const workExpsModule = require("../public/helpers/workExpOptionsList");
const workplaceModule = require("../public/helpers/workplaceOptionsList");

module.exports = class Database {
  constructor() {
    this.sqlGetAllRegions = "SELECT * FROM region";
    this.sqlGetAllTechAndTools = "SELECT * FROM technologies_and_tools";
    this.sqlGetAllStudentDetails = `SELECT student_details.*,
        (SELECT GROUP_CONCAT(student_technology_tool.technology_tool_id)
           FROM student_technology_tool
          WHERE student_technology_tool.student_id = student_details.id) AS technologies_and_tools
      FROM student_details`;
    this.sqlGetAllStudentIds = `SELECT id FROM student_details`;
    this.sqlInsertStudentDetails =
      "INSERT INTO student_details(name, surname, patronymic, date_of_birth, summary, profile_picture, region_id, city, street, house_number, mobile_number, email, linkedin, github, education_level_id, university, specialty, english_level_id, position_id, work_experience_id, work_area_id, salary_id, workplace_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  }

  getSqlOneStudent(studentId) {
    return `SELECT student_details.*,
        (SELECT GROUP_CONCAT(student_technology_tool.technology_tool_id)
           FROM student_technology_tool
          WHERE student_technology_tool.student_id = student_details.id) AS technologies_and_tools
      FROM student_details WHERE id = ${studentId}`;
  }

  getSqlMultipleStudents(resultIds) {
    return `SELECT student_details.*,
    (SELECT GROUP_CONCAT(student_technology_tool.technology_tool_id)
       FROM student_technology_tool
      WHERE student_technology_tool.student_id = student_details.id) AS technologies_and_tools
  FROM student_details WHERE id IN (${resultIds}) ORDER BY FIELD(student_details.id, ${resultIds})`;
  }

  getSqlStudentIdsByPosition(studentPosition) {
    return `SELECT id FROM student_details WHERE student_details.position_id = "${studentPosition}"`;
  }

  getSqlStudentIdsByWorkArea(studentWorkArea) {
    let workAreaIds =[];
    for (const [key, value] of Object.entries(workAreaModule.workAreas)) {
      workAreaIds.push(value.id);
    };
    let requiredWorkAreas;
    if (studentWorkArea == workAreaIds[0]) {
      requiredWorkAreas = [1,3]
    } 
    else if (studentWorkArea == workAreaIds[1]){
      requiredWorkAreas = [2,3];
    } else {
      requiredWorkAreas = studentWorkArea;
    };
    console.log("required work area: " + requiredWorkAreas);
    return `SELECT id FROM student_details WHERE student_details.work_area_id IN (${requiredWorkAreas})`;
  }

  getSqlStudentIdsByWorkExp(studentWorkExp) {
    let workExpIds =[];
    for (const [key, value] of Object.entries(workExpsModule.workExps)) {
      workExpIds.push(value.id);
    };
    let requiredWorkExps = workExpIds.slice(0, studentWorkExp);
    console.log("required experiences: " + requiredWorkExps);
    return `SELECT id FROM student_details WHERE student_details.work_experience_id IN (${requiredWorkExps})`;
  }

  getSqlStudentIdsByTechAndTools(techAndToolsIds) {
    return `SELECT student_id FROM student_technology_tool WHERE student_technology_tool.technology_tool_id IN (${techAndToolsIds})`;
  }

  getSqlStudentIdsByEnglish(studentEnglish) {
    let englishIds =[];
    for (const [key, value] of Object.entries(englishModule.englishLevels)) {
      englishIds.push(value.id);
    };
    let requiredEnglishLevels = englishIds.slice(0, studentEnglish);
    console.log("required english: " + requiredEnglishLevels);
    return `SELECT id FROM student_details WHERE student_details.english_level_id IN (${requiredEnglishLevels})`;
  }

  getSqlStudentIdsByWorkplace(studentWorkplace) {
    let workplacesIds =[];
    for (const [key, value] of Object.entries(workplaceModule.workplaces)) {
      workplacesIds.push(value.id);
    };
    let requiredWorplaces ;
    if (studentWorkplace == workplacesIds[0]) {
      requiredWorplaces = [1,3]
    } 
    else if (studentWorkplace == workplacesIds[1]){
      requiredWorplaces = [2,3];
    } else {
      requiredWorplaces = workplacesIds;
    }
    return `SELECT id FROM student_details WHERE student_details.workplace_id IN (${requiredWorplaces})`;
  }

  getSqlStudentIdsByRegion(studentRegion) {
    return `SELECT id FROM student_details WHERE student_details.region_id = "${studentRegion}"`;
  }

  getSqlStudentIdsByEducation(studentEducation) {
    return `SELECT id FROM student_details WHERE student_details.education_level_id = "${studentEducation}"`;
  }

  getSqlStudentIdsByCity(studentCity) {
    return `SELECT id FROM student_details WHERE student_details.city = "${studentCity}"`;
  }

  getSqlStudentIdsBySalary(studentSalary) {
    return `SELECT id FROM student_details WHERE student_details.salary_id = "${studentSalary}"`;
  }
};
