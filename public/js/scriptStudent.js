const form = document.querySelector("form"),
  nextBtn = form.querySelector(".nextBtn"),
  backBtn = form.querySelector(".backBtn"),
  allInput = form.querySelectorAll(".first input");
  submitBtn = form.querySelector(".sumbit");

nextBtn.addEventListener("click", () => {
  allInput.forEach((input) => {
    if (input.value != "") {
      form.classList.add("secActive");
    } else {
      form.classList.remove("secActive");
    }
  });
});

backBtn.addEventListener("click", () => form.classList.remove("secActive"));

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // отримуємо дані з форми
  let studentSurname = form.elements["studentSurname"].value;
  let studentName = form.elements["studentName"].value;
  let studentPatronymic = form.elements["studentPatronymic"].value;
  let studentDateOfBirth = form.elements["studentDateOfBirth"].value;
  let studentMobNumber = form.elements["studentMobNumber"].value;
  let studentEmail = form.elements["studentEmail"].value;
  let studentRegion = form.elements["studentRegion"].value;
  let studentCity = form.elements["studentCity"].value;
  let studentStreet = form.elements["studentStreet"].value;
  let studentHouseNum = form.elements["studentHouseNum"].value;
  let studentLinkedin = form.elements["studentLinkedin"].value;
  let studentGithub = form.elements["studentGithub"].value;
  let studentEducation = form.elements["studentEducation"].value;
  let studentUniversity = form.elements["studentUniversity"].value;
  let studentSpecialty = form.elements["studentSpecialty"].value;
  let studentTechAndTools = form.elements["studentTechAndTools"].value;
  let studentEnglish = form.elements["studentEnglish"].value;
  let studentSummary = form.elements["studentSummary"].value;
  let studentPosition = form.elements["studentPosition"].value;
  let studentWorkExp = form.elements["studentWorkExp"].value;
  let studentWorkArea = form.elements["studentWorkArea"].value;
  let studentSalary = form.elements["studentSalary"].value;
  let studentWorkplace = form.elements["studentWorkplace"].value;
  let studentProfilePic = form.elements["studentProfilePic"].value;
  // серіалізуємо дані в json
  let student = JSON.stringify({
    studentSurname: studentSurname,
    studentName: studentName,
    studentPatronymic: studentPatronymic,
    studentDateOfBirth: studentDateOfBirth,
    studentMobNumber: studentMobNumber,
    studentEmail: studentEmail,
    studentRegion: studentRegion,
    studentCity: studentCity,
    studentStreet: studentStreet,
    studentHouseNum: studentHouseNum,
    studentLinkedin: studentLinkedin,
    studentGithub: studentGithub,
    studentEducation: studentEducation,
    studentUniversity: studentUniversity,
    studentSpecialty: studentSpecialty,
    studentTechAndTools: studentTechAndTools,
    studentEnglish: studentEnglish,
    studentSummary: studentSummary,
    studentPosition: studentPosition,
    studentWorkExp: studentWorkExp,
    studentWorkArea: studentWorkArea,
    studentSalary: studentSalary,
    studentWorkplace: studentWorkplace,
    studentProfilePic: studentProfilePic
  });
  let request = new XMLHttpRequest();
  // надсилаємо запит на адресу "/students"
  request.open("POST", "/students", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.addEventListener("load", function () {

    console.log(request.response);

    window.location.replace("/successful-registration");
    // отримуємо та парсимо відповідь сервера
    // let receivedStudent = JSON.parse(request.response);
    // console.log(receivedStudent.studentName, "-", receivedStudent.studentSurname); // відповідь сервера
  });
  request.send(student);
});
