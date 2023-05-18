// 1 룬 세팅 선택에 따른 배경 변화
var rune = document.getElementById("rune-1");
rune.addEventListener("click", function (e) {
  document.getElementById("rune-1").style.borderLeft = "3px solid red";
  document.getElementById("rune-1").style.backgroundColor =
    "rgb(200, 200, 200)";
  document.getElementById("rune-2").style.borderLeft = "none";
  document.getElementById("rune-2").style.backgroundColor = "rgb(90, 90, 90)";

  document.getElementById("rune-1-detail").style.display = "flex";
  document.getElementById("rune-2-detail").style.display = "none";
});

// 2 룬 세팅 선택에 따른 배경 변화
var rune2 = document.getElementById("rune-2");
rune2.addEventListener("click", function (e) {
  document.getElementById("rune-2").style.borderLeft = "3px solid red";
  document.getElementById("rune-2").style.backgroundColor =
    "rgb(200, 200, 200)";
  document.getElementById("rune-1").style.borderLeft = "none";
  document.getElementById("rune-1").style.backgroundColor = "rgb(90, 90, 90)";

  document.getElementById("rune-2-detail").style.display = "flex";
  document.getElementById("rune-1-detail").style.display = "none";
});

// 1 신화 아이템 선택에 따른 배경 변화
var mythicItem1 = document.getElementById("mythic-item-box-1");
mythicItem1.addEventListener("click", function (e) {
  document.getElementById("mythic-item-box-1").style.borderTop =
    "2px solid rgb(255, 255, 115)";
  document.getElementById("mythic-item-box-1").style.backgroundColor =
    "rgb(200, 200, 200)";
  document.getElementById("mythic-item-box-1").style.color = "#000000";
  document.getElementById("mythic-item-box-1").style.opacity = "1";
  document.getElementById("mythic-item-box-1").style.filter = "none";

  document.getElementById("mythic-item-box-2").style.borderTop = "none";
  document.getElementById("mythic-item-box-2").style.backgroundColor =
    "rgb(55, 55, 55)";
  document.getElementById("mythic-item-box-2").style.color = "#fff";
  document.getElementById("mythic-item-box-2").style.opacity = "0.3";
  document.getElementById("mythic-item-box-2").style.filter = "grayscale(1)";

  document.getElementById("mythic-1-detail").style.display = "flex";
  document.getElementById("mythic-2-detail").style.display = "none";
});

// 2 신화 아이템 선택에 따른 배경 변화
var mythicItem2 = document.getElementById("mythic-item-box-2");
mythicItem2.addEventListener("click", function (e) {
  document.getElementById("mythic-item-box-2").style.borderTop =
    "2px solid rgb(255, 255, 115)";
  document.getElementById("mythic-item-box-2").style.backgroundColor =
    "rgb(200, 200, 200)";
  document.getElementById("mythic-item-box-2").style.color = "#000000";
  document.getElementById("mythic-item-box-2").style.opacity = "1";
  document.getElementById("mythic-item-box-2").style.filter = "none";

  document.getElementById("mythic-item-box-1").style.borderTop = "none";
  document.getElementById("mythic-item-box-1").style.backgroundColor =
    "rgb(55, 55, 55)";
  document.getElementById("mythic-item-box-1").style.color = "#fff";
  document.getElementById("mythic-item-box-1").style.opacity = "0.3";
  document.getElementById("mythic-item-box-1").style.filter = "grayscale(1)";

  document.getElementById("mythic-2-detail").style.display = "flex";
  document.getElementById("mythic-1-detail").style.display = "none";
});
