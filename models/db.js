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
  FROM student_details WHERE id IN (${resultIds})`;
  }

  getSqlStudentIdsByPosition(studentPosition) {
    return `SELECT id FROM student_details WHERE student_details.position_id = "${studentPosition}"`;
  }

  getSqlStudentIdsByWorkArea(studentWorkArea) {
    `SELECT id FROM student_details WHERE student_details.work_area_id = "${studentWorkArea}"`;
  }

  getSqlStudentIdsByWorkExp(studentWorkExp) {
    return `SELECT id FROM student_details WHERE student_details.work_experience_id = "${studentWorkExp}"`;
  }

  getSqlStudentIdsByPosition(studentPosition) {
    return `SELECT id FROM student_details WHERE student_details.position_id = "${studentPosition}"`;
  }

  getSqlStudentIdsByPosition(studentPosition) {
    return `SELECT id FROM student_details WHERE student_details.position_id = "${studentPosition}"`;
  }

  getSqlStudentIdsByTechAndTools(techAndToolsIds) {
    return `SELECT student_id FROM student_technology_tool WHERE student_technology_tool.technology_tool_id IN (${techAndToolsIds})`;
  }

  getSqlStudentIdsByEnglish(studentEnglish) {
    return `SELECT id FROM student_details WHERE student_details.english_level_id = "${studentEnglish}"`;
  }

  getSqlStudentIdsByWorkplace(studentWorkplace) {
    return `SELECT id FROM student_details WHERE student_details.workplace_id = "${studentWorkplace}"`;
  }

  getSqlStudentIdsByEducation(studentEducation) {
    return `SELECT id FROM student_details WHERE student_details.education_level_id = "${studentEducation}"`;
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
