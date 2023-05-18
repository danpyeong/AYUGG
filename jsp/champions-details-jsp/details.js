const axios = require("axios");

window.onload = function () {
  axios
    .get(
      "https://ddragon.leagueoflegends.com/cdn/11.22.1/data/ko_KR/champion.json"
    )
    .then(function (response) {
      var championsData = response.data.data;
      var championsDiv = document.getElementById("champions");

      for (var championKey in championsData) {
        if (championsData.hasOwnProperty(championKey)) {
          var champion = championsData[championKey];
          var championImage = champion.image;

          var img = document.createElement("img");
          img.src =
            "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/champion/" +
            championImage.full;
          img.width = 24;
          img.height = 24;

          var li = document.createElement("li");
          li.appendChild(img);

          championsDiv.appendChild(li);
        }
      }
    })
    .catch(function (error) {
      console.error("API 요청 오류 :", error);
    });
};

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
