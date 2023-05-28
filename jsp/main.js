let date = new Date();
let todayMonth = date.getMonth() + 1;
let todayDate = date.getDate();
let todayDay = date.getDay();
const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

window.onload = function () {
  document.getElementById("today-date").innerText =
    todayMonth + "월 " + todayDate + "일" + " (" + WEEKDAY[todayDay] + ")";
};
