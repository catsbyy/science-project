const connectionPromise = require("../app.js").connection;
const db = require("../models/db.js");
const dbHelper = new db();

module.exports = class Filter {
  async getResultsByFilters(params) {
    let students = [];
    const defaultValue = await connectionPromise(dbHelper.sqlGetAllStudentDetails, "");
    if (Object.keys(params).length === 0) students = defaultValue;
    else {
      let techAndToolsIds = [];

      if (
        params.studentTechAndTools !== "" &&
        params.studentTechAndTools !== null &&
        params.studentTechAndTools !== undefined
      ) {
        techAndToolsIds = params.studentTechAndTools
          .split(";")
          .filter(function (el) {
            return el !== "";
          })
          .map(Number);
      }

      // основні параметри
      // співпадіння по посаді
      let positionMatches = await this.getMatchesByFilter(
        params.studentPosition,
        dbHelper.getSqlStudentIdsByPosition(params.studentPosition)
      );

      // співпадіння по області роботи
      const workAreaMatches = await this.getMatchesByFilter(
        params.studentWorkArea,
        dbHelper.getSqlStudentIdsByWorkArea(params.studentWorkArea)
      );

      // співпадіння по досвіду роботи
      let workExpMatches = await this.getMatchesByFilter(
        params.studentWorkExp,
        dbHelper.getSqlStudentIdsByWorkExp(params.studentWorkExp)
      );

      // співпадіння по технологіям - найголовніше
      console.log("tools right before calling db: " + techAndToolsIds);
      let techAndToolsMatches = [];
      if (Array.isArray(techAndToolsIds) && techAndToolsIds.length) {
        techAndToolsMatches = await this.getMatchesByFilter(
          techAndToolsIds,
          dbHelper.getSqlStudentIdsByTechAndTools(techAndToolsIds.toString())
        );
      }

      // співпадіння по англійській
      let englishMatches = await this.getMatchesByFilter(
        params.studentEnglish,
        dbHelper.getSqlStudentIdsByEnglish(params.studentEnglish)
      );

      // співпадіння по освіті
      let educationMatches = await this.getMatchesByFilter(
        params.studentEducation,
        dbHelper.getSqlStudentIdsByEducation(params.studentEducation)
      );

      // додаткові параметри
      // співпадіння по області
      let regionMatches = await this.getMatchesByFilter(
        params.studentRegion,
        dbHelper.getSqlStudentIdsByRegion(params.studentRegion)
      );

      // співпадіння по місту
      let cityMatches = await this.getMatchesByFilter(
        params.studentCity,
        dbHelper.getSqlStudentIdsByCity(params.studentCity)
      );

      // співпадіння по місцю роботи
      let workplaceMatches = await this.getMatchesByFilter(
        params.studentWorkplace,
        dbHelper.getSqlStudentIdsByWorkplace(params.studentWorkplace)
      );

      // співпадіння по заробітній платі
      let salaryMatches = await this.getMatchesByFilter(
        params.studentSalary,
        dbHelper.getSqlStudentIdsBySalary(params.studentSalary)
      );

      let resultsObj = {
        techAndTools: techAndToolsMatches,
        workArea: workAreaMatches,
        position: positionMatches,
        english: englishMatches,
        workExp: workExpMatches,
        education: educationMatches,
        salary: salaryMatches,
        region: regionMatches,
        workplace: workplaceMatches,
        city: cityMatches,
      };

      let resultSet = resultsObj.techAndTools;
      let keys = Object.keys(resultsObj);

      // пошук ідеальних кандидатів
      for (const [key, value] of Object.entries(resultsObj)) {
        console.log(`RESULTOBJ: ${key}: ${value}`);

        let nextIndex = keys.indexOf(key) + 1;
        let nextItem = keys[nextIndex];

        resultSet = this.getMatchesIntersection(resultSet, resultsObj[nextItem]);
      }

      console.log("final result set -------- " + resultSet);

      // перетини результатів - пошук кандидатів
      console.log("workArea: " + workAreaMatches);
      console.log("workExpMatches: " + workExpMatches);
      console.log("techAndToolsMatches: " + techAndToolsMatches);
      console.log("englishMatches: " + englishMatches);
      console.log("educationMatches: " + educationMatches);
      console.log("regionMatches: " + regionMatches);
      console.log("cityMatches: " + cityMatches);
      console.log("workplaceMatches: " + workplaceMatches);
      console.log("salaryMatches: " + salaryMatches);

      let result = resultSet;

      console.log("result: " + result);

      if (result.length) {
        result = result;
        result = this.getAdditionalResults(result, resultsObj);
      } else {
        try {
          result = this.getAdditionalResults(result, resultsObj);
        } catch {
          console.log("default ---------- " + defaultValue);
        }
      }

      students =
        result.length !== 0 ? await connectionPromise(dbHelper.getSqlMultipleStudents(result), "") : defaultValue;
    }
    return students;
  }

  async getMatchesByFilter(filter, sql) {
    let matches = [];
    if (filter === "" || filter === null || filter === undefined) {
      return matches;
    } else {
      matches = await connectionPromise(sql, "");
      return sql.includes("student_technology_tool") ? matches.map((a) => a.student_id) : matches.map((a) => a.id);
    }
  }

  getMatchesIntersection(a, b) {
    let intersection;

    if (a !== "" && a !== null && a !== undefined && a.length !== 0) {
      if (b !== "" && b !== null && b !== undefined && b.length !== 0) {
        intersection = a.filter((el) => b.includes(el));
      } else {
        intersection = a;
      }
    } else {
      if (b !== "" && b !== null && b !== undefined && b.length !== 0) {
        intersection = b;
      } else {
        intersection = [];
      }
    }
    return intersection;
  }

  getMatchesUnion(a, b) {
    let union;

    if (a !== "" && a !== null && a !== undefined && a.length !== 0) {
      if (b !== "" && b !== null && b !== undefined && b.length !== 0) {
        union = [...new Set([...a, ...b])];
      } else {
        union = a;
      }
    } else {
      if (b !== "" && b !== null && b !== undefined && b.length !== 0) {
        union = b;
      } else {
        union = [];
      }
    }

    return union;
  }

  getAdditionalResults(currentResult, separateMatchesObj) {
    let expandedResults = this.getMatchesUnion(currentResult, separateMatchesObj.techAndTools);

    let keys = Object.keys(separateMatchesObj);

    // пошук додаткових кандидатів
    for (const [key, value] of Object.entries(separateMatchesObj)) {
      if (expandedResults.length < 20) {
        console.log(`RESULTOBJ: ${key}: ${value}`);

        let nextIndex = keys.indexOf(key) + 1;
        let nextItem = keys[nextIndex];

        expandedResults = this.getMatchesUnion(expandedResults, separateMatchesObj[nextItem]);
        //console.log(key + " ---- resultSet: " + expandedResults + " nextItem: " + separateMatchesObj[nextItem]);
      } else break;
    }

    return expandedResults;
  }
};
