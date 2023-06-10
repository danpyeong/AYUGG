const runeJson = "data/ko_KR/runesReforged.json";
const runeUrl = version + runeJson;

const runeImgUrl = "https://ddragon.leagueoflegends.com/cdn/img/";
const statsImgUrl = "../../../images/perk/";

const skillImgUrl = "http://ddragon.leagueoflegends.com/cdn/13.11.1/img/spell/";

// 1 룬 세팅 선택에 따른 배경 변화
const rune1 = document.getElementById("rune-1");
const rune2 = document.getElementById("rune-2");

rune1.addEventListener("click", function (e) {
  rune1.style.borderLeft = "3px solid red";
  document.getElementById("rune-1").style.backgroundColor =
    "rgb(200, 200, 200)";
  document.getElementById("rune-2").style.borderLeft = "none";
  document.getElementById("rune-2").style.backgroundColor = "rgb(90, 90, 90)";
});

// 2 룬 세팅 선택에 따른 배경 변화
rune2.addEventListener("click", function (e) {
  document.getElementById("rune-2").style.borderLeft = "3px solid red";
  document.getElementById("rune-2").style.backgroundColor =
    "rgb(200, 200, 200)";
  document.getElementById("rune-1").style.borderLeft = "none";
  document.getElementById("rune-1").style.backgroundColor = "rgb(90, 90, 90)";
});

window.onload = fetch(runeUrl)
  .then((response) => response.json())
  .then(async function (rawData) {
    const allData = rawData;
    let runeMap;
    let skillTree;
    const runeSkillUrl = "../../../json/runeSkill.json";
    await fetch(runeSkillUrl)
      .then((response) => response.json())
      .then(function (rawData) {
        let championId = "Garen";
        let data = Object.values(rawData);
        let championData;

        for (let i = 0; i < data.length; i++) {
          if (data[i].id == championId) {
            championData = data[i].data;
            break;
          }
        }

        skillTree = championData.skill;
        let runeData = championData.rune.version1;
        let mainRune = runeData.mainRune;
        let subRune = runeData.subRune;
        let stats = runeData.stats;

        //#region 추천 룬 선택 박스 초기화

        //#region 변수
        let page1Main = championData.rune.version1.mainTitle;
        let page1Sub = championData.rune.version1.subTitle;
        let page1Pick = championData.rune.version1.pickRate;
        let page1Win = championData.rune.version1.winRate;

        let page2Main = championData.rune.version2.mainTitle;
        let page2Sub = championData.rune.version2.subTitle;
        let page2Pick = championData.rune.version2.pickRate;
        let page2Win = championData.rune.version2.winRate;
        //#endregion

        for (let i = 0; i < allData.length; i++) {
          if (allData[i].id == page1Main) {
            document.getElementById("main-rune-1").src =
              runeImgUrl + allData[i].icon;
            document.getElementById("rune-pick-1").innerText = page1Pick;
            document.getElementById("rune-win-1").innerText = page1Win;
          }
          if (allData[i].id == page1Sub) {
            document.getElementById("sub-rune-1").src =
              runeImgUrl + allData[i].icon;
          }
          if (allData[i].id == page2Main) {
            document.getElementById("main-rune-2").src =
              runeImgUrl + allData[i].icon;
            document.getElementById("rune-pick-2").innerText = page2Pick;
            document.getElementById("rune-win-2").innerText = page2Win;
          }
          if (allData[i].id == page2Sub) {
            document.getElementById("sub-rune-2").src =
              runeImgUrl + allData[i].icon;
          }
        }
        //#endregion

        runeMap = {
          mainTitle: runeData.mainTitle,
          subTitle: runeData.subTitle,
          mainId: mainRune.id,
          mainLine1: mainRune.line1,
          mainLine2: mainRune.line2,
          mainLine3: mainRune.line3,
          subLine1: subRune.line1,
          subLine2: subRune.line2,
          stats1: stats.line1,
          stats2: stats.line2,
          stats3: stats.line3,
          winRate: runeData.winRate,
          pickRate: runeData.pickRate,
        };

        rune1.addEventListener("click", function (e) {
          runeData = championData.rune.version1;
          mainRune = runeData.mainRune;
          subRune = runeData.subRune;
          stats = runeData.stats;

          runeMap = {
            mainTitle: runeData.mainTitle,
            subTitle: runeData.subTitle,
            mainId: mainRune.id,
            mainLine1: mainRune.line1,
            mainLine2: mainRune.line2,
            mainLine3: mainRune.line3,
            subLine1: subRune.line1,
            subLine2: subRune.line2,
            stats1: stats.line1,
            stats2: stats.line2,
            stats3: stats.line3,
            winRate: runeData.winRate,
            pickRate: runeData.pickRate,
          };
          runePage(runeMap);
        });

        rune2.addEventListener("click", function (e) {
          runeData = championData.rune.version2;
          mainRune = runeData.mainRune;
          subRune = runeData.subRune;
          stats = runeData.stats;

          runeMap = {
            mainTitle: runeData.mainTitle,
            subTitle: runeData.subTitle,
            mainId: mainRune.id,
            mainLine1: mainRune.line1,
            mainLine2: mainRune.line2,
            mainLine3: mainRune.line3,
            subLine1: subRune.line1,
            subLine2: subRune.line2,
            stats1: stats.line1,
            stats2: stats.line2,
            stats3: stats.line3,
            winRate: runeData.winRate,
            pickRate: runeData.pickRate,
          };
          runePage(runeMap);
        });
      });

    //#region 룬 변수 초기화

    //#region   메인 룬 박스
    const mainRuneTitle = document.getElementById("main-rune-title-1");
    // -----------------------------------------------------------------------
    const mainFirstRune1 = document.getElementById("main-first-rune-1-1");
    const mainFirstRune2 = document.getElementById("main-first-rune-1-2");
    const mainFirstRune3 = document.getElementById("main-first-rune-1-3");
    const mainFirstRune4 = document.getElementById("main-first-rune-1-4");
    let mainFirstRune = [];
    mainFirstRune.push(mainFirstRune1);
    mainFirstRune.push(mainFirstRune2);
    mainFirstRune.push(mainFirstRune3);
    mainFirstRune.push(mainFirstRune4);
    // -----------------------------------------------------------------------
    const mainFirstLine1 = document.getElementById("main-first-line-1-1");
    const mainFirstLine2 = document.getElementById("main-first-line-1-2");
    const mainFirstLine3 = document.getElementById("main-first-line-1-3");
    let mainFirstLine = [];
    mainFirstLine.push(mainFirstLine1);
    mainFirstLine.push(mainFirstLine2);
    mainFirstLine.push(mainFirstLine3);
    // -----------------------------------------------------------------------
    const mainSecondLine1 = document.getElementById("main-second-line-1-1");
    const mainSecondLine2 = document.getElementById("main-second-line-1-2");
    const mainSecondLine3 = document.getElementById("main-second-line-1-3");
    let mainSecondLine = [];
    mainSecondLine.push(mainSecondLine1);
    mainSecondLine.push(mainSecondLine2);
    mainSecondLine.push(mainSecondLine3);
    // -----------------------------------------------------------------------
    const mainThirdLine1 = document.getElementById("main-third-line-1-1");
    const mainThirdLine2 = document.getElementById("main-third-line-1-2");
    const mainThirdLine3 = document.getElementById("main-third-line-1-3");
    let mainThirdLine = [];
    mainThirdLine.push(mainThirdLine1);
    mainThirdLine.push(mainThirdLine2);
    mainThirdLine.push(mainThirdLine3);
    // -----------------------------------------------------------------------
    //#endregion

    //#region   서브 룬 박스
    const subRuneTitle = document.getElementById("sub-rune-title-1");
    // -----------------------------------------------------------------------
    const subFirstLine1 = document.getElementById("sub-first-line-1-1");
    const subFirstLine2 = document.getElementById("sub-first-line-1-2");
    const subFirstLine3 = document.getElementById("sub-first-line-1-3");
    let subFirstLine = [];
    subFirstLine.push(subFirstLine1);
    subFirstLine.push(subFirstLine2);
    subFirstLine.push(subFirstLine3);
    // -----------------------------------------------------------------------
    const subSecondLine1 = document.getElementById("sub-second-line-1-1");
    const subSecondLine2 = document.getElementById("sub-second-line-1-2");
    const subSecondLine3 = document.getElementById("sub-second-line-1-3");
    let subSecondLine = [];
    subSecondLine.push(subSecondLine1);
    subSecondLine.push(subSecondLine2);
    subSecondLine.push(subSecondLine3);
    // -----------------------------------------------------------------------
    const subThirdLine1 = document.getElementById("sub-third-line-1-1");
    const subThirdLine2 = document.getElementById("sub-third-line-1-2");
    const subThirdLine3 = document.getElementById("sub-third-line-1-3");
    let subThirdLine = [];
    subThirdLine.push(subThirdLine1);
    subThirdLine.push(subThirdLine2);
    subThirdLine.push(subThirdLine3);
    // -----------------------------------------------------------------------
    //#endregion

    //#region   특성 박스
    const statsFirstLine1 = document.getElementById("char-first-line-1-1");
    const statsFirstLine2 = document.getElementById("char-first-line-1-2");
    const statsFirstLine3 = document.getElementById("char-first-line-1-3");
    let statsFirstLine = [];
    statsFirstLine.push(statsFirstLine1);
    statsFirstLine.push(statsFirstLine2);
    statsFirstLine.push(statsFirstLine3);
    // -----------------------------------------------------------------------
    const statsSecondLine1 = document.getElementById("char-second-line-1-1");
    const statsSecondLine2 = document.getElementById("char-second-line-1-2");
    const statsSecondLine3 = document.getElementById("char-second-line-1-3");
    let statsSecondLine = [];
    statsSecondLine.push(statsSecondLine1);
    statsSecondLine.push(statsSecondLine2);
    statsSecondLine.push(statsSecondLine3);
    // -----------------------------------------------------------------------
    const statsThirdLine1 = document.getElementById("char-third-line-1-1");
    const statsThirdLine2 = document.getElementById("char-third-line-1-2");
    const statsThirdLine3 = document.getElementById("char-third-line-1-3");
    let statsThirdLine = [];
    statsThirdLine.push(statsThirdLine1);
    statsThirdLine.push(statsThirdLine2);
    statsThirdLine.push(statsThirdLine3);
    //#endregion

    //#endregion
    function runePage(runeMapData) {
      for (let i = 0; i < rawData.length; i++) {
        if (rawData[i].id == runeMapData.mainTitle) {
          //#region 메인 룬
          var mRune = rawData[i].slots[0].runes;
          var mFLine = rawData[i].slots[1].runes;
          var mSLine = rawData[i].slots[2].runes;
          var mTLine = rawData[i].slots[3].runes;

          mainRuneTitle.src = runeImgUrl + rawData[i].icon;
          var lastRune = document.getElementById("main-rune-frame-4");
          for (let mRuneC = 0; mRuneC < mRune.length; mRuneC++) {
            if (mRune.length == 3) {
              lastRune.style.display = "none";
            } else {
              lastRune.style.display = "block";
            }

            mainFirstRune[mRuneC].src = runeImgUrl + mRune[mRuneC].icon;
            var allRune = document.getElementById(
              "main-rune-frame-" + (mRuneC + 1)
            );
            allRune.className = "rune-frame rune-invisible";
            if (runeMapData.mainId == mRune[mRuneC].id) {
              allRune.className = "rune-frame rune-visible";
            }
          }

          for (let mLineC = 0; mLineC < mFLine.length; mLineC++) {
            mainFirstLine[mLineC].src = runeImgUrl + mFLine[mLineC].icon;
            mainFirstLine[mLineC].className = "rune-invisible";
            if (runeMapData.mainLine1 == mFLine[mLineC].id) {
              mainFirstLine[mLineC].className = "rune-visible";
            }
            mainSecondLine[mLineC].src = runeImgUrl + mSLine[mLineC].icon;
            mainSecondLine[mLineC].className = "rune-invisible";
            if (runeMapData.mainLine2 == mSLine[mLineC].id) {
              mainSecondLine[mLineC].className = "rune-visible";
            }
            mainThirdLine[mLineC].src = runeImgUrl + mTLine[mLineC].icon;
            mainThirdLine[mLineC].className = "rune-invisible";
            if (runeMapData.mainLine3 == mTLine[mLineC].id) {
              mainThirdLine[mLineC].className = "rune-visible";
            }
          }
          //#endregion

          //#region 서브 룬
          for (let j = 0; j < rawData.length; j++) {
            var sFLine = rawData[j].slots[1].runes;
            var sSLine = rawData[j].slots[2].runes;
            var sTLine = rawData[j].slots[3].runes;

            if (rawData[j].id == runeMapData.subTitle) {
              subRuneTitle.src = runeImgUrl + rawData[j].icon;

              for (let sLineC = 0; sLineC < sFLine.length; sLineC++) {
                subFirstLine[sLineC].src = runeImgUrl + sFLine[sLineC].icon;
                subFirstLine[sLineC].className = "rune-invisible";
                if (
                  runeMapData.subLine1 == sFLine[sLineC].id ||
                  runeMapData.subLine2 == sFLine[sLineC].id
                ) {
                  subFirstLine[sLineC].className = "rune-visible";
                }
                subSecondLine[sLineC].src = runeImgUrl + sSLine[sLineC].icon;
                subSecondLine[sLineC].className = "rune-invisible";
                if (
                  runeMapData.subLine1 == sSLine[sLineC].id ||
                  runeMapData.subLine2 == sSLine[sLineC].id
                ) {
                  subSecondLine[sLineC].className = "rune-visible";
                }
                subThirdLine[sLineC].src = runeImgUrl + sTLine[sLineC].icon;
                subThirdLine[sLineC].className = "rune-invisible";
                if (
                  runeMapData.subLine1 == sTLine[sLineC].id ||
                  runeMapData.subLine2 == sTLine[sLineC].id
                ) {
                  subThirdLine[sLineC].className = "rune-visible";
                }
              }
            }
          }
          //#endregion

          //#region 특성
          statsFirstLine1.src = statsImgUrl + "5008.png";
          statsFirstLine2.src = statsImgUrl + "5005.png";
          statsFirstLine3.src = statsImgUrl + "5007.png";
          statsSecondLine1.src = statsImgUrl + "5008.png";
          statsSecondLine2.src = statsImgUrl + "5002.png";
          statsSecondLine3.src = statsImgUrl + "5003.png";
          statsThirdLine1.src = statsImgUrl + "5001.png";
          statsThirdLine2.src = statsImgUrl + "5002.png";
          statsThirdLine3.src = statsImgUrl + "5003.png";

          for (let sLineC = 0; sLineC < statsFirstLine.length; sLineC++) {
            if (statsFirstLine[sLineC].src.includes(runeMap.stats1)) {
              statsFirstLine[sLineC].style.backgroundColor = "black";
            }
            if (statsSecondLine[sLineC].src.includes(runeMap.stats2)) {
              statsSecondLine[sLineC].style.backgroundColor = "black";
            }
            if (statsThirdLine[sLineC].src.includes(runeMap.stats3)) {
              statsThirdLine[sLineC].style.backgroundColor = "black";
            }
          }

          //#endregion
          return;
        }
      }
    }
    runePage(runeMap);

    // 스킬
    let skillMaster = Object.values(skillTree.master);
    let skillOrder = Object.values(skillTree.order);
    console.log(skillOrder);

    for (let i = 0; i < skillMaster.length; i++) {
      var skill = document.getElementById("skillImg-" + (i + 1));
      var skillKey = document.getElementById("skill-" + (i + 1) + "-position");
      skill.src = skillImgUrl + skillMaster[i].id;
      skillKey.innerText = skillMaster[i].key;
    }

    for (let i = 0; i < skillOrder.length; i++) {
      var order = document.getElementById("skill-" + (i + 1));
      var orderKey = document.getElementById("skillKey-" + (i + 1));
      orderKey.innerText = skillOrder[i];
      // if (skillOrder[i] == "Q") {
      //   orderKey.style.color = "rgb(255, 92, 92)";
      // }
      // if (skillOrder[i] == "W") {
      //   orderKey.style.color = "rgb(255, 92, 92)";
      // }
      // if (skillOrder[i] == "E") {
      //   orderKey.style.color = "rgb(255, 92, 92)";
      // }
      if (skillOrder[i] == "R") {
        order.style.backgroundColor = "rgb(96, 96, 240)";
        order.style.color = "#fff";
        orderKey.style.backgroundColor = "rgb(96, 96, 240)";
        orderKey.style.color = "#fff";
      }
    }
  });
