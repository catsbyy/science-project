const englishModule = require("../public/helpers/englishLevelsList");
const workAreaModule = require("../public/helpers/workAreaOptionsList");
const workExpsModule = require("../public/helpers/workExpOptionsList");
const workplaceModule = require("../public/helpers/workplaceOptionsList");

module.exports = class Database {
  constructor() {
    this.sqlGetAllRegions = "SELECT * FROM region";
    this.sqlGetAllTechAndTools = "SELECT * FROM technologies_and_tools";
    this.sqlGetAllEnglishLevels = "SELECT * FROM english_level";
    this.sqlGetAllEducationLevels = "SELECT * FROM education_level";
    this.sqlGetAllPositions = "SELECT * FROM position";
    this.sqlGetAllSalaries = "SELECT * FROM salary";
    this.sqlGetAllWorkAreas = "SELECT * FROM work_area";
    this.sqlGetAllWorkExps = "SELECT * FROM work_experience";
    this.sqlGetAllWorkplaces = "SELECT * FROM workplace";

    this.sqlGetAllCandidateDetails = `SELECT candidate_details.*,
        (SELECT GROUP_CONCAT(candidate_technology_tool.technology_tool_id)
           FROM candidate_technology_tool
          WHERE candidate_technology_tool.candidate_id = candidate_details.id) AS technologies_and_tools
      FROM candidate_details`;
    this.sqlGetAllCandidateIds = `SELECT id FROM candidate_details`;
    this.sqlInsertCandidateDetails =
      "INSERT INTO candidate_details(name, surname, patronymic, date_of_birth, summary, profile_picture, region_id, city, street, house_number, mobile_number, email, linkedin, github, education_level_id, university, specialty, english_level_id, position_id, work_experience_id, work_area_id, salary_id, workplace_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  }

  getSqlOneCandidate(candidateId, isByUserId) {
    return `SELECT candidate_details.*,
      (SELECT GROUP_CONCAT(candidate_technology_tool.technology_tool_id)
         FROM candidate_technology_tool
        WHERE candidate_technology_tool.candidate_id = candidate_details.id) AS technologies_and_tools
      FROM candidate_details WHERE ${isByUserId === "true" ? `user_id = ${candidateId}` : `id = ${candidateId}`}`;
  }

  getSqlMultipleCandidates(resultIds) {
    return `SELECT candidate_details.*,
    (SELECT GROUP_CONCAT(candidate_technology_tool.technology_tool_id)
       FROM candidate_technology_tool
      WHERE candidate_technology_tool.candidate_id = candidate_details.id) AS technologies_and_tools
  FROM candidate_details WHERE id IN (${resultIds}) ORDER BY FIELD(candidate_details.id, ${resultIds})`;
  }

  createInClause(ids) {
    return ids.length ? `IN (${ids.join(",")})` : "= -1"; // Prevents empty IN clause error
  }

  getSqlCandidateIdsByField(field, values) {
    const clause = this.createInClause(values);
    return `SELECT id FROM candidate_details WHERE ${field} ${clause}`;
  }

  getSqlCandidateIdsByPosition(candidatePosition) {
    return this.getSqlCandidateIdsByField("position_id", [candidatePosition]);
  }

  getSqlCandidateIdsByWorkArea(candidateWorkArea) {
    const workAreaMap = {
      [workAreaModule.workAreas[0].id]: [1, 3],
      [workAreaModule.workAreas[1].id]: [2, 3],
    };
    const requiredWorkAreas = workAreaMap[candidateWorkArea] || [candidateWorkArea];
    return this.getSqlCandidateIdsByField("work_area_id", requiredWorkAreas);
  }

  getSqlCandidateIdsByWorkExp(candidateWorkExp) {
    const workExpIds = Object.values(workExpsModule.workExps).map((exp) => exp.id);
    const requiredWorkExps = workExpIds.slice(0, candidateWorkExp);
    return this.getSqlCandidateIdsByField("work_experience_id", requiredWorkExps);
  }

  getSqlCandidateIdsByTechAndTools(techAndToolsIds) {
    const clause = this.createInClause(techAndToolsIds);
    return `SELECT candidate_id FROM candidate_technology_tool WHERE technology_tool_id ${clause}`;
  }

  getSqlCandidateIdsByEnglish(candidateEnglish) {
    const englishIds = Object.values(englishModule.englishLevels).map((level) => level.id);
    const requiredEnglishLevels = englishIds.slice(0, candidateEnglish);
    return this.getSqlCandidateIdsByField("english_level_id", requiredEnglishLevels);
  }

  getSqlCandidateIdsByWorkplace(candidateWorkplace) {
    const workplaceMap = {
      [workplaceModule.workplaces[0].id]: [1, 3],
      [workplaceModule.workplaces[1].id]: [2, 3],
    };
    const requiredWorkplaces = workplaceMap[candidateWorkplace] || [candidateWorkplace];
    return this.getSqlCandidateIdsByField("workplace_id", requiredWorkplaces);
  }

  getSqlCandidateIdsByRegion(candidateRegion) {
    return this.getSqlCandidateIdsByField("region_id", [candidateRegion]);
  }

  getSqlCandidateIdsByEducation(candidateEducation) {
    return this.getSqlCandidateIdsByField("education_level_id", [candidateEducation]);
  }

  getSqlCandidateIdsByCity(candidateCity) {
    return `SELECT id FROM candidate_details WHERE city = "${candidateCity}"`;
  }

  getSqlCandidateIdsBySalary(candidateSalary) {
    return this.getSqlCandidateIdsByField("salary_id", [candidateSalary]);
  }
};
