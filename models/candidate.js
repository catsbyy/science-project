module.exports = class Candidate {
    constructor(request) {
        this.candidateName = request.body.candidateName,
        this.candidateSurname = request.body.candidateSurname,
        this.candidatePatronymic = request.body.candidatePatronymic,
        this.candidateDateOfBirth = request.body.candidateDateOfBirth,
        this.candidateSummary = request.body.candidateSummary,
        this.candidateProfilePic = request.body.candidateProfilePic,
        this.candidateRegion = request.body.candidateRegion,
        this.candidateCity = request.body.candidateCity,
        this.candidateStreet = request.body.candidateStreet,
        this.candidateHouseNum = request.body.candidateHouseNum,
        this.candidateMobNumber = request.body.candidateMobNumber,
        this.candidateEmail = request.body.candidateEmail,
        this.candidateLinkedin = request.body.candidateLinkedin,
        this.candidateGithub = request.body.candidateGithub,
        this.candidateEducation = request.body.candidateEducation,
        this.candidateUniversity = request.body.candidateUniversity,
        this.candidateSpecialty = request.body.candidateSpecialty,
        this.candidateEnglish = request.body.candidateEnglish,
        this.candidatePosition = request.body.candidatePosition,
        this.candidateWorkExp = request.body.candidateWorkExp,
        this.candidateWorkArea = request.body.candidateWorkArea,
        this.candidateSalary = request.body.candidateSalary,
        this.candidateWorkplace = request.body.candidateWorkplace,
        this.candidateTechAndTools = request.body.candidateTechAndTools,
        this.userId = request.body.userId
    }
  };
  