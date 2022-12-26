const form = document.querySelector("form"),
  submitBtn = form.querySelector(".sumbit");

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // отримуємо дані з форми
  let studentEducation = form.elements["studentEducation"].value;
  let studentRegion = form.elements["studentRegion"].value;
  let studentCity = form.elements["studentCity"].value;
  let studentTechAndTools = form.elements["studentTechAndTools"].value;
  let studentEnglish = form.elements["studentEnglish"].value;
  let studentPosition = form.elements["studentPosition"].value;
  let studentWorkExp = form.elements["studentWorkExp"].value;
  let studentWorkArea = form.elements["studentWorkArea"].value;
  let studentSalary = form.elements["studentSalary"].value;
  let studentWorkplace = form.elements["studentWorkplace"].value;
  // серіалізуємо дані в json
  let student = JSON.stringify({
    studentEducation: studentEducation,
    studentRegion: studentRegion,
    studentCity: studentCity,
    studentTechAndTools: studentTechAndTools,
    studentEnglish: studentEnglish,
    studentPosition: studentPosition,
    studentWorkExp: studentWorkExp,
    studentWorkArea: studentWorkArea,
    studentSalary: studentSalary,
    studentWorkplace: studentWorkplace
  });
  let request = new XMLHttpRequest();
  // надсилаємо запит на адресу "/business"
  request.open("POST", "/business", true);
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
