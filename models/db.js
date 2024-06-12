const englishModule = require("../public/helpers/englishLevelsList");
const workAreaModule = require("../public/helpers/workAreaOptionsList");
const workExpsModule = require("../public/helpers/workExpOptionsList");
const workplaceModule = require("../public/helpers/workplaceOptionsList");

module.exports = class Database {
  constructor() {
    this.sqlGetAllRegions = "SELECT * FROM region";
    this.sqlGetAllTechAndTools = "SELECT * FROM technologies_and_tools";
    this.sqlGetAllCandidateDetails = `SELECT candidate_details.*,
        (SELECT GROUP_CONCAT(candidate_technology_tool.technology_tool_id)
           FROM candidate_technology_tool
          WHERE candidate_technology_tool.candidate_id = candidate_details.id) AS technologies_and_tools
      FROM candidate_details`;
    this.sqlGetAllCandidateIds = `SELECT id FROM candidate_details`;
    this.sqlInsertCandidateDetails =
      "INSERT INTO candidate_details(name, surname, patronymic, date_of_birth, summary, profile_picture, region_id, city, street, house_number, mobile_number, email, linkedin, github, education_level_id, university, specialty, english_level_id, position_id, work_experience_id, work_area_id, salary_id, workplace_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  }

  getSqlOneCandidate(candidateId) {
    return `SELECT candidate_details.*,
        (SELECT GROUP_CONCAT(candidate_technology_tool.technology_tool_id)
           FROM candidate_technology_tool
          WHERE candidate_technology_tool.candidate_id = candidate_details.id) AS technologies_and_tools
      FROM candidate_details WHERE id = ${candidateId}`;
  }

  getSqlMultiplecCandidates(resultIds) {
    return `SELECT candidate_details.*,
    (SELECT GROUP_CONCAT(candidate_technology_tool.technology_tool_id)
       FROM candidate_technology_tool
      WHERE candidate_technology_tool.candidate_id = candidate_details.id) AS technologies_and_tools
  FROM candidate_details WHERE id IN (${resultIds}) ORDER BY FIELD(candidate_details.id, ${resultIds})`;
  }

  getSqlCandidateIdsByPosition(candidatePosition) {
    return `SELECT id FROM candidate_details WHERE candidate_details.position_id = "${candidatePosition}"`;
  }

  getSqlCandidateIdsByWorkArea(candidateWorkArea) {
    let workAreaIds =[];
    for (const [key, value] of Object.entries(workAreaModule.workAreas)) {
      workAreaIds.push(value.id);
    };
    let requiredWorkAreas;
    if (candidateWorkArea == workAreaIds[0]) {
      requiredWorkAreas = [1,3]
    } 
    else if (candidateWorkArea == workAreaIds[1]){
      requiredWorkAreas = [2,3];
    } else {
      requiredWorkAreas = candidateWorkArea;
    };
    console.log("required work area: " + requiredWorkAreas);
    return `SELECT id FROM candidate_details WHERE candidate_details.work_area_id IN (${requiredWorkAreas})`;
  }

  getSqlCandidateIdsByWorkExp(candidateWorkExp) {
    let workExpIds =[];
    for (const [key, value] of Object.entries(workExpsModule.workExps)) {
      workExpIds.push(value.id);
    };
    let requiredWorkExps = workExpIds.slice(0, candidateWorkExp);
    console.log("required experiences: " + requiredWorkExps);
    return `SELECT id FROM candidate_details WHERE candidate_details.work_experience_id IN (${requiredWorkExps})`;
  }

  getSqlCandidateIdsByTechAndTools(techAndToolsIds) {
    return `SELECT candidate_id FROM candidate_technology_tool WHERE candidate_technology_tool.technology_tool_id IN (${techAndToolsIds})`;
  }

  getSqlCandidateIdsByEnglish(candidateEnglish) {
    let englishIds =[];
    for (const [key, value] of Object.entries(englishModule.englishLevels)) {
      englishIds.push(value.id);
    };
    let requiredEnglishLevels = englishIds.slice(0, candidateEnglish);
    console.log("required english: " + requiredEnglishLevels);
    return `SELECT id FROM candidate_details WHERE candidate_details.english_level_id IN (${requiredEnglishLevels})`;
  }

  getSqlCandidateIdsByWorkplace(candidateWorkplace) {
    let workplacesIds =[];
    for (const [key, value] of Object.entries(workplaceModule.workplaces)) {
      workplacesIds.push(value.id);
    };
    let requiredWorplaces ;
    if (candidateWorkplace == workplacesIds[0]) {
      requiredWorplaces = [1,3]
    } 
    else if (candidateWorkplace == workplacesIds[1]){
      requiredWorplaces = [2,3];
    } else {
      requiredWorplaces = workplacesIds;
    }
    return `SELECT id FROM candidate_details WHERE candidate_details.workplace_id IN (${requiredWorplaces})`;
  }

  getSqlCandidateIdsByRegion(candidateRegion) {
    return `SELECT id FROM candidate_details WHERE candidate_details.region_id = "${candidateRegion}"`;
  }

  getSqlCandidateIdsByEducation(candidateEducation) {
    return `SELECT id FROM candidate_details WHERE candidate_details.education_level_id = "${candidateEducation}"`;
  }

  getSqlCandidateIdsByCity(candidateCity) {
    return `SELECT id FROM candidate_details WHERE candidate_details.city = "${candidateCity}"`;
  }

  getSqlCandidateIdsBySalary(candidateSalary) {
    return `SELECT id FROM candidate_details WHERE candidate_details.salary_id = "${candidateSalary}"`;
  }
};
