const connectionPromise = require("../app.js").connection;
const db = require("../models/db.js");
const dbHelper = new db();

module.exports = class Filter {
  async getResultsByFilters(params) {
    let candidates = [];
    const defaultValue = await connectionPromise(dbHelper.sqlGetAllCandidateDetails, "");
    if (Object.keys(params).length === 0) candidates = defaultValue;
    else {
      let techAndToolsIds = [];

      if (
        params.candidateTechAndTools !== "" &&
        params.candidateTechAndTools !== null &&
        params.candidateTechAndTools !== undefined
      ) {
        techAndToolsIds = params.candidateTechAndTools
          .split(";")
          .filter(function (el) {
            return el !== "";
          })
          .map(Number);
      }

      // Вага фільтрів
      const filterWeights = {
        techAndTools: 0.3,
        position: 0.2,
        workArea: 0.2,
        workExp: 0.15,       
        english: 0.1,
        education: 0.05,
        salary: 0.05,
        region: 0.02,
        city: 0.02,
        workplace: 0.01,
      };

      // Основні фільтри: важливі фільтри включають технології, позицію, область роботи, досвід та англійську
      const essentialFilters = {
        techAndTools: await this.getMatchesByFilter(
          techAndToolsIds,
          dbHelper.getSqlCandidateIdsByTechAndTools(techAndToolsIds.toString())
        ),
        position: await this.getMatchesByFilter(
          params.candidatePosition,
          dbHelper.getSqlCandidateIdsByPosition(params.candidatePosition)
        ),
        workArea: await this.getMatchesByFilter(
          params.candidateWorkArea,
          dbHelper.getSqlCandidateIdsByWorkArea(params.candidateWorkArea)
        ),
        workExp: await this.getMatchesByFilter(
          params.candidateWorkExp,
          dbHelper.getSqlCandidateIdsByWorkExp(params.candidateWorkExp)
        ),
        english: await this.getMatchesByFilter(
          params.candidateEnglish,
          dbHelper.getSqlCandidateIdsByEnglish(params.candidateEnglish)
        ),
      };

      // Перевіряємо, чи кандидати проходять через важливі фільтри
      const essentialCandidates = this.getEssentialCandidates(essentialFilters);

      if (essentialCandidates.length === 0) {
        return defaultValue; // Якщо немає жодного кандидата, який відповідає важливим фільтрам
      }

      // Збирання збігів по решті фільтрів тільки для кандидатів, які пройшли через важливі
      const filtersResults = {
        techAndTools: essentialFilters.techAndTools,
        position: essentialFilters.position,
        workArea: essentialFilters.workArea,
        workExp: essentialFilters.workExp,
        english: essentialFilters.english,
        education: await this.getMatchesByFilter(
          params.candidateEducation,
          dbHelper.getSqlCandidateIdsByEducation(params.candidateEducation)
        ),
        salary: await this.getMatchesByFilter(
          params.candidateSalary,
          dbHelper.getSqlCandidateIdsBySalary(params.candidateSalary)
        ),
        region: await this.getMatchesByFilter(
          params.candidateRegion,
          dbHelper.getSqlCandidateIdsByRegion(params.candidateRegion)
        ),
        city: await this.getMatchesByFilter(
          params.candidateCity,
          dbHelper.getSqlCandidateIdsByCity(params.candidateCity)
        ),
        workplace: await this.getMatchesByFilter(
          params.candidateWorkplace,
          dbHelper.getSqlCandidateIdsByWorkplace(params.candidateWorkplace)
        ),
      };

      // Обчислення рейтингу кандидатів
      const candidatesScores = {};
      for (const [filter, matches] of Object.entries(filtersResults)) {
        matches.forEach(candidateId => {
          if (!candidatesScores[candidateId]) {
            candidatesScores[candidateId] = 0;
          }
          candidatesScores[candidateId] += filterWeights[filter]; // Додаємо вагу кожного фільтру до кандидата
        });
      }

      // Пошук кандидатів з найвищими рейтингами
      const sortedCandidates = Object.keys(candidatesScores)
        .filter(id => candidatesScores[id] > 0) // Враховуємо тільки тих, у кого є збіги
        .sort((a, b) => candidatesScores[b] - candidatesScores[a]); // Сортуємо за рейтингом

      candidates = sortedCandidates.length > 0 
        ? await connectionPromise(dbHelper.getSqlMultipleCandidates(sortedCandidates), "") 
        : defaultValue;
    }
    return candidates;
  }

  async getMatchesByFilter(filter, sql) {
    let matches = [];
    if (filter === "" || filter === null || filter === undefined) {
      return matches;
    } else {
      matches = await connectionPromise(sql, "");
      return sql.includes("candidate_technology_tool") ? matches.map((a) => a.candidate_id) : matches.map((a) => a.id);
    }
  }

  // Функція для перевірки відповідності кандидатів важливим фільтрам
  getEssentialCandidates(essentialFilters) {
    let essentialCandidates = essentialFilters.techAndTools;

    // Перетинаємо результати важливих фільтрів (англійська, технології, позиція, досвід та область роботи)
    essentialCandidates = this.getMatchesIntersection(essentialCandidates, essentialFilters.position);
    essentialCandidates = this.getMatchesIntersection(essentialCandidates, essentialFilters.workArea);
    essentialCandidates = this.getMatchesIntersection(essentialCandidates, essentialFilters.workExp);
    essentialCandidates = this.getMatchesIntersection(essentialCandidates, essentialFilters.english);

    return essentialCandidates; // Повертаємо кандидатів, які відповідають обов'язковим критеріям
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
};