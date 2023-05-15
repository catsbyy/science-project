module.exports = class Student {
    constructor(request) {
        this.studentName = request.body.studentName,
        this.studentSurname = request.body.studentSurname,
        this.studentPatronymic = request.body.studentPatronymic,
        this.studentDateOfBirth = request.body.studentDateOfBirth,
        this.studentSummary = request.body.studentSummary,
        this.studentProfilePic = request.body.studentProfilePic,
        this.studentRegion = request.body.studentRegion,
        this.studentCity = request.body.studentCity,
        this.studentStreet = request.body.studentStreet,
        this.studentHouseNum = request.body.studentHouseNum,
        this.studentMobNumber = request.body.studentMobNumber,
        this.studentEmail = request.body.studentEmail,
        this.studentLinkedin = request.body.studentLinkedin,
        this.studentGithub = request.body.studentGithub,
        this.studentEducation = request.body.studentEducation,
        this.studentUniversity = request.body.studentUniversity,
        this.studentSpecialty = request.body.studentSpecialty,
        this.studentEnglish = request.body.studentEnglish,
        this.studentPosition = request.body.studentPosition,
        this.studentWorkExp = request.body.studentWorkExp,
        this.studentWorkArea = request.body.studentWorkArea,
        this.studentSalary = request.body.studentSalary,
        this.studentWorkplace = request.body.studentWorkplace,
        this.studentTechAndTools = request.body.studentTechAndTools
    }
  };
  