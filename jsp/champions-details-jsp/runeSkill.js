const rune = "data/ko_KR/runesReforged.json";
const runeUrl = version + rune;

fetch(runeUrl)
  .then((response) => response.json())
  .then(async function (rawData) {
    console.log(rawData);
    let runeMap;

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

        let runeData = championData.rune.version1;
        let mainRune = runeData.mainRune;
        let subRune = runeData.subRune;
        let stats = runeData.stats;

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
        };

        rune1.addEventListener("click", function (e) {
          runeData = championData.rune.version2;
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
          };
          console.log(runeMap);
        });

        rune2.addEventListener("click", function (e) {
          runeData = championData.rune.version1;
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
          };
          console.log(runeMap);
        });
      });

    //#region 룬 변수 초기화

    //#region   좌측 선택 박스
    const mainRune = document.getElementById("main-rune-1");
    const subRune = document.getElementById("sub-rune-1");
    const pickRate = document.getElementById("rune-pick");
    const winRate = document.getElementById("rune-win");
    //#endregion

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
    // -----------------------------------------------------------------------
    const subSecondLine1 = document.getElementById("sub-second-line-1-1");
    const subSecondLine2 = document.getElementById("sub-second-line-1-2");
    const subSecondLine3 = document.getElementById("sub-second-line-1-3");
    // -----------------------------------------------------------------------
    const subThirdLine1 = document.getElementById("sub-third-line-1-1");
    const subThirdLine2 = document.getElementById("sub-third-line-1-2");
    const subThirdLine3 = document.getElementById("sub-third-line-1-3");
    // -----------------------------------------------------------------------
    //#endregion

    //#region   특성 박스
    const statsFirstLine1 = document.getElementById("char-first-line-1-1");
    const statsFirstLine2 = document.getElementById("char-first-line-1-2");
    const statsFirstLine3 = document.getElementById("char-first-line-1-3");
    // -----------------------------------------------------------------------
    const statsSecondLine1 = document.getElementById("char-second-line-1-1");
    const statsSecondLine2 = document.getElementById("char-second-line-1-2");
    const statsSecondLine3 = document.getElementById("char-second-line-1-3");
    // -----------------------------------------------------------------------
    const statsThirdLine1 = document.getElementById("char-third-line-1-1");
    const statsThirdLine2 = document.getElementById("char-third-line-1-2");
    const statsThirdLine3 = document.getElementById("char-third-line-1-3");
    //#endregion

    //#endregion

    const runeImgUrl = "https://ddragon.leagueoflegends.com/cdn/img/";
    // https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png
    console.log(runeMap);

    function runePage(runeMap) {
      for (let i = 0; i < rawData.length; i++) {
        if (rawData[i].id == runeMap.mainTitle) {
          //    메인 룬
          var mRune = rawData[i].slots[0].runes;
          var mFLine = rawData[i].slots[1].runes;
          var mSLine = rawData[i].slots[2].runes;
          var mTLine = rawData[i].slots[3].runes;

          mainRune.src = runeImgUrl + rawData[i].icon;
          pickRate.innerText = runeMap.pickRate;
          winRate.innerText = runeMap.winRate;

          mainRuneTitle.src = runeImgUrl + rawData[i].icon;

          for (var mRuneC = 0; mRuneC < mRune.length; mRuneC++) {
            mainFirstRune[mRuneC].src = runeImgUrl + mRune.icon;
          }
          for (var mLineC = 0; mLineC < mRune.length; ) {
            mainFirstLine[mLineC].src = runeImgUrl + mLineC.icon;
          }

          //    서브 룬
          for (let j = 0; j < rawData.length; j++) {
            if (rawData[j].id == runeMap.subTitle) {
              subRune.src = runeImgUrl + rawData[j].icon;
            }
          }
          return;
        }
      }
    }
    runePage(runeMap);
  });
