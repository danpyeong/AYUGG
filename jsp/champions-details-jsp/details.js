const version = "https://ddragon.leagueoflegends.com/cdn/13.10.1/";

const championUrl = version + "data/ko_KR/champion.json";

fetch(championUrl)
  .then((response) => response.json())
  .then(function (data) {
    // 모든 챔피언 데이터
    var champData = data.data;

    // 위 데이터를 담은 배열
    var champDataList = Object.values(champData);
    var champList = document.getElementById("champions-list");

    for (var i = 0; i < champDataList.length; i++) {
      // console.log(champDataList[i]);

      const childLi = document.createElement("li");
      const childSpan = document.createElement("span");
      const childImg = document.createElement("img");
      const childDiv = document.createElement("div");
      const champName = champDataList[i].id.toString().toLowerCase();

      // 챔피언 초상화
      childImg.src = version + "img/champion/" + champDataList[i].image.full;
      childImg.width = 24;
      childImg.height = 24;

      // 챔피언 이름
      childDiv.textContent = champDataList[i].name;

      childSpan.onclick = function () {
        // fs.rename("details.html", champName + ".html", function (err) {
        //   if (err) throw err;
        //   console.log("File Renamed.");
        // });
        window.location.href = champName + ".html";
      };

      childSpan.appendChild(childImg);
      childSpan.appendChild(childDiv);
      childLi.appendChild(childSpan);
      champList.appendChild(childLi);
    }
  });

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
