module.exports = class Filter {
    constructor() {
      this.sqlGetAllRegions = "SELECT * FROM region";
      this.sqlGetAllTechAndTools = "SELECT * FROM technologies_and_tools";
      this.sqlGetAllStudentDetails = `SELECT student_details.*,
          (SELECT GROUP_CONCAT(student_technology_tool.technology_tool_id)
             FROM student_technology_tool
            WHERE student_technology_tool.student_id = student_details.id) AS technologies_and_tools
        FROM student_details`;
      this.sqlGetAllStudentIds = `SELECT id FROM student_details`;
      this.sqlInsertStudentDetails = "INSERT INTO student_details(name, surname, patronymic, date_of_birth, summary, profile_picture, region_id, city, street, house_number, mobile_number, email, linkedin, github, education_level_id, university, specialty, english_level_id, position_id, work_experience_id, work_area_id, salary_id, workplace_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    }

    getMatchesByFilter = async function (filter, sql) {
        console.log("filter: " + filter);
        console.log("sql: " + sql);
        let matches = [];
        if (filter === "" || filter === null || filter === undefined) {
          return matches;
        } else {
          matches = await connectionPromise(sql, "");
          return sql.includes("student_technology_tool") ? matches.map((a) => a.student_id) : matches.map((a) => a.id);
        }
        //console.log(sql + ": " + matches.map((a) => a.id));
        //if (sql.includes("student_technology_tool")) console.log("special for tools: " + matches.map((a) => a.student_id));
      };
  
    getMatchesIntersection = function (a, b) {
        let result;
      
        if (a !== "" && a !== null && a !== undefined && a.length !== 0) {
          if (b !== "" && b !== null && b !== undefined && b.length !== 0) {
            result = a.filter((el) => b.includes(el));
            console.log("it was a and b not nulls " + result);
          } else {
            result = a;
            console.log("it was a " + result);
          }
        } else {
          if (b !== "" && b !== null && b !== undefined && b.length !== 0) {
            result = b;
            console.log("it was b " + result);
          } else {
            result = [];
            console.log("both are null " + result);
          }
        }
        return result;
      };
  };
  