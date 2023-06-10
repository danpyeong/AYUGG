const version = "https://ddragon.leagueoflegends.com/cdn/13.11.1/";
const championUrl = version + "data/ko_KR/champion.json";

window.onload = fetch(championUrl)
  .then((response) => response.json())
  .then(async function (data) {
    // 위 데이터를 담은 배열
    var champDataList = Object.values(data.data);

    // 한글 기준 오름차순 정렬
    champDataList.sort(function (a, b) {
      var nameA = a.name;
      var nameB = b.name;
      return nameA.localeCompare(nameB);
    });

    // 분석 페이지에서 데이터를 받아와서 해당 챔피언 이름 넣어야함.
    var champion = champDataList[0];

    const championImg = document.getElementById("championImg");
    championImg.src = version + "img/champion/" + champion.image.full;

    const championName = champion.id;
    const championDetailUrl =
      version + "data/ko_KR/champion/" + championName + ".json";

    fetch(championDetailUrl)
      .then((response) => response.json())
      .then(function (rawData) {
        var detailData = Object.values(rawData.data);
        var championDetail = detailData[0];
        var spell = detailData[0].spells;

        const passiveImg = document.getElementById("passiveImg");
        passiveImg.src =
          version + "img/passive/" + championDetail.passive.image.full;

        const QImg = document.getElementById("skill-Q");
        QImg.src = version + "img/spell/" + spell[0].image.full;
        const WImg = document.getElementById("skill-W");
        WImg.src = version + "img/spell/" + spell[1].image.full;
        const EImg = document.getElementById("skill-E");
        EImg.src = version + "img/spell/" + spell[2].image.full;
        const RImg = document.getElementById("skill-R");
        RImg.src = version + "img/spell/" + spell[3].image.full;
      });

    const counterUrl = "../../../json/counter.json";

    fetch(counterUrl)
      .then((response) => response.json())
      .then(function (rawData) {
        var data = Object.values(rawData);

        var winNumber = 0;
        var loseNumber = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].win == true) {
            winNumber++;
            const counterImg = document.getElementById(
              "win-counter-" + winNumber
            );
            counterImg.src = data[i].championImg;
            const counterName = document.getElementById(
              "win-counter-" + winNumber + "-name"
            );
            counterName.innerHTML = data[i].championName;
            const counterRate = document.getElementById(
              "win-rate-" + winNumber
            );
            counterRate.innerHTML = data[i].winRate;
          } else {
            loseNumber++;
            const counterImg = document.getElementById(
              "lose-counter-" + loseNumber
            );
            counterImg.src = data[i].championImg;
            const counterName = document.getElementById(
              "lose-counter-" + loseNumber + "-name"
            );
            counterName.innerHTML = data[i].championName;
            const counterRate = document.getElementById(
              "lose-rate-" + loseNumber
            );
            counterRate.innerHTML = data[i].winRate;
          }
        }
      });
  });

// 1 룬 세팅 선택에 따른 배경 변화
const rune1 = document.getElementById("rune-1");
const rune2 = document.getElementById("rune-2");
rune1.addEventListener("click", function (e) {
  rune1.style.borderLeft = "3px solid red";
  document.getElementById("rune-1").style.backgroundColor =
    "rgb(200, 200, 200)";
  document.getElementById("rune-2").style.borderLeft = "none";
  document.getElementById("rune-2").style.backgroundColor = "rgb(90, 90, 90)";

  document.getElementById("rune-1-detail").style.display = "flex";
  document.getElementById("rune-2-detail").style.display = "none";
});

// 2 룬 세팅 선택에 따른 배경 변화
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
