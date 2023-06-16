// const fs = require("fs");
const version = "https://ddragon.leagueoflegends.com/cdn/13.11.1/";

const championUrl = version + "data/ko_KR/champion.json";

fetch(championUrl)
  .then((response) => response.json())
  .then(function (data) {
    // 위 데이터를 담은 배열
    var champDataList = Object.values(data.data);
    var champList = document.getElementById("champions-list");

    // 한글 기준 오름차순 정렬
    champDataList.sort(function (a, b) {
      var nameA = a.name;
      var nameB = b.name;
      return nameA.localeCompare(nameB);
    });

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
        window.location.href = champName + ".html";
      };

      childSpan.appendChild(childImg);
      childSpan.appendChild(childDiv);
      childLi.appendChild(childSpan);
      champList.appendChild(childLi);
    }
  });

const champSearch = document.getElementById("championSearch");
champSearch.addEventListener("keyup", function () {
  if (window.event.keyCode == 13) {
    if (mainInput.value == "") {
      return;
    } else {
      // window.location.href = mainInput.value + ".html";
      // sessionStorage.setItem("nickname", mainInput.value);
      // recentEvent(mainInput.value);
    }
  }
});
