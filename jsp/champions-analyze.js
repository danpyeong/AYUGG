// const fs = require("fs");
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
