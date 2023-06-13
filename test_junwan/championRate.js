const apiKey = "RGAPI-2bf344d0-b611-4f82-af11-d70e7c1baee1";

const version = "https://ddragon.leagueoflegends.com/cdn/13.10.1/";
const championUrl = version + "data/ko_KR/champion.json";

// 티어별 유저 정보
const tierUserStartUrl = "https://kr.api.riotgames.com/lol/league/v4/entries";
const division = ["/I", "/II", "/III", "/IV"];
const tier = ["/IRON", "/BRONZE", "/SILVER", "/GOLD", "/PLATINUM", "/DIAMOND"];
const queue = ["/RANKED_SOLO_5x5", "/RANKED_FLEX_SR", "/RANKED_FLEX_TT"];
const pageCount = 1;

let tierUserUrl =
  tierUserStartUrl +
  queue[0] +
  tier[4] +
  division[0] +
  "?page=" +
  pageCount +
  "&api_key=" +
  apiKey;

async function loadData() {
  // 티어에 따른 유저 닉네임 뽑아내는 함수
  var tierUserUrlResponse = await fetch(tierUserUrl);

  var tierUserRawData = tierUserUrlResponse.json();

  let tierUserList = [];
  // -----promise 객체에서 데이터 뽑아내기
  const tierUserData = tierUserRawData;

  const gettierUserData = async (
    start,
    last,
    dataCount,
    index,
    banSize,
    userSize
  ) => {
    await tierUserRawData.then(async (rawData) => {
      let data = [];
      let encodedName = [];
      //  rawData 에 담긴 205명 중 10명만 - 최대 : i < rawData.length
      // a 번째부터 b 번째 까지
      // let start = 176;
      // let last = 180;
      // const dataCount = 31;

      // let index = last - start;
      console.log(
        "start : " +
          start +
          " / last : " +
          last +
          " / dataCount : " +
          dataCount +
          " / index : " +
          index
      );
      for (let i = start; i < last; i++) {
        data.push(Object.values(rawData[i]));
        tierUserList.push(data[index - (last - i)][5]);
        var testURI = encodeURI(
          data[index - (last - i)][5].charAt(0)
        ).toString();
        if (testURI.charAt(0) == "%") {
          encodedName.push(encodeURI(data[index - (last - i)][5]));
        }
      }
      //#region 유저별 puuid
      const uidStartUrl =
        "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
      let uidDataList = [];
      let uidList = [];

      for (let i = 0; i < encodedName.length; i++) {
        const uidUrl = uidStartUrl + encodedName[i] + "?api_key=" + apiKey;
        try {
          var uidUrlResponse = await fetch(uidUrl);
          var uidRawData = uidUrlResponse.json();
          uidDataList.push(uidRawData);
          const getUidData = async () => {
            await uidDataList[i].then(async (rawData) => {
              let data = Object.values(rawData);
              uidList.push(data[2]);
            });
          };
          await getUidData();
        } catch (err) {
          console.log("error : " + err);
          continue;
        }
      }
      //#endregion

      //#region 유저당 5개의 matchID 추출 - 최대 : matchCount = 100
      const matchStartUrl =
        "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/";
      const matchCount = 5;
      let matchList = [];

      for (let i = 0; i < uidList.length; i++) {
        const matchUrl =
          matchStartUrl +
          uidList[i] +
          "/ids?queue=420&start=0&count=" +
          matchCount +
          "&api_key=" +
          apiKey;

        var matchUrlResponse = await fetch(matchUrl);
        var matchRawData = matchUrlResponse.json();
        const getMatchData = async () => {
          await matchRawData.then(async (rawData) => {
            let data = Object.values(rawData);
            for (let i = 0; i < data.length; i++) {
              if (matchList.includes(data[i]) == false) {
                matchList.push(data[i]);
              }
            }
          });
        };
        await getMatchData();
      }
      //#endregion

      //#region matchList를 이용해서 게임 내역을 받고 거기서 데이터 빼오기
      const inGameStartUrl =
        "https://asia.api.riotgames.com/lol/match/v5/matches/";

      let gameDataList = [];
      let userListData = [];
      let userList = [];
      let banChampionIdList = [];
      for (let i = 0; i < matchList.length; i++) {
        const inGameUrl = inGameStartUrl + matchList[i] + "?api_key=" + apiKey;
        var inGameUrlResponse = await fetch(inGameUrl);
        var inGameRawData = inGameUrlResponse.json();
        const getInGameData = async () => {
          await inGameRawData.then((rawData) => {
            let data = Object.values(rawData);
            gameDataList.push(Object.values(data[1]));
            //#region  밴 챔피언 List
            for (let j = 0; j < 5; j++) {
              banChampionIdList.push(gameDataList[i][13][0].bans[j].championId);
              banChampionIdList.push(gameDataList[i][13][1].bans[j].championId);
            }
            //#endregion

            userListData = gameDataList[i][10];
            for (let i = 0; i < userListData.length; i++) {
              const statsObject = {
                defense: userListData[i].perks.statPerks.defense,
                flex: userListData[i].perks.statPerks.flex,
                offense: userListData[i].perks.statPerks.offense,
              };
              const mainRuneObject = {
                styleRune: userListData[i].perks.styles[0].style,
                titleRune: userListData[i].perks.styles[0].selections[0].perk,
                firstRune: userListData[i].perks.styles[0].selections[1].perk,
                secondRune: userListData[i].perks.styles[0].selections[2].perk,
                thirdRune: userListData[i].perks.styles[0].selections[3].perk,
              };

              const subRuneObject = {
                styleRune: userListData[i].perks.styles[1].style,
                firstRune: userListData[i].perks.styles[1].selections[0].perk,
                secondRune: userListData[i].perks.styles[1].selections[1].perk,
              };

              const runeObject = {
                stats: statsObject,
                mainRune: mainRuneObject,
                subRune: subRuneObject,
              };

              const spellObject = {
                spell1: userListData[i].summoner1Id,
                spell2: userListData[i].summoner2Id,
              };

              const itemObject = {
                item0: userListData[i].item0,
                item1: userListData[i].item1,
                item2: userListData[i].item2,
                item3: userListData[i].item3,
                item4: userListData[i].item4,
                item5: userListData[i].item5,
                item6: userListData[i].item6,
              };

              const userObject = {
                championName: userListData[i].championName,
                versus: userListData[Math.abs((i + 15) % 10)].championName,
                teamId: userListData[i].teamId,
                lane: userListData[i].teamPosition,
                rune: runeObject,
                spell: spellObject,
                item: itemObject,
                win: userListData[i].win,
              };
              //#endregion

              userList.push(userObject);
              // console.log(userList);
            }
          });
        };
        await getInGameData();
      }
      console.log(userList);
      //#endregion

      //#endregion

      for (let i = 0; i < banChampionIdList.length; i++) {
        localStorage.setItem("ban" + banSize, banChampionIdList[i]);
        console.log("ban Success");
        banSize++;
      }
      for (let i = 0; i < userList.length; i++) {
        localStorage.setItem("user" + userSize, JSON.stringify(userList[i]));
        console.log("userData Success");
        userSize++;
      }
      localStorage.setItem("dataCount", dataCount);
    });
  };
  function wait(sec) {
    let start = Date.now(),
      now = start;
    while (now - start < sec * 1000) {
      now = Date.now();
    }
  }

  let start = 80;
  let last = start + 5;
  let dataCount = 17;
  let index = last - start;
  let banSize = 16000;
  let userSize = 16000;

  // for (let i = 0; i < 4; i++) {
  //   await gettierUserData(start, last, dataCount, index, banSize, userSize);
  //   start += 5;
  //   last = start + 5;
  //   dataCount++;
  //   banSize += 1000;
  //   userSize += 1000;
  //   wait(10);
  // }
  // await gettierUserData(start, last, dataCount, index);

  ////////////////////////////////////////////////////////////////
}
// loadData();

var length = localStorage.length;
let banList = [];
let userList = [];
let etc = [];

for (let i = 0; i < length; i++) {
  if (localStorage.key(i).charAt(0) == "u") {
    userList.push(localStorage.key(i));
  } else if (localStorage.key(i).charAt(0) == "b") {
    banList.push(localStorage.key(i));
  } else {
    etc.push(localStorage.key(i));
  }
}

//#region userList, banLIst
userList.sort(function (a, b) {
  var aNum = parseInt(a.substring(4));
  var bNum = parseInt(b.substring(4));
  return aNum - bNum;
});

let userDataList = [];

for (let i = 0; i < userList.length; i++) {
  userDataList.push(JSON.parse(localStorage[`${userList[i]}`]));
}

banList.sort(function (a, b) {
  var aNum = parseInt(a.substring(3));
  var bNum = parseInt(b.substring(3));
  return aNum - bNum;
});

let banDataList = [];

for (let i = 0; i < banList.length; i++) {
  banDataList.push(localStorage[`${banList[i]}`]);
}
//#endregion

fetch(championUrl)
  .then((res) => res.json())
  .then(function await(rawData) {
    var cDL = Object.values(rawData.data);
    var champList = document.getElementById("champions-list");

    // 한글 기준 오름차순 정렬
    cDL.sort(function (a, b) {
      var nameA = a.name;
      var nameB = b.name;
      return nameA.localeCompare(nameB);
    });

    var champDataList = [];
    for (let i = 0; i < cDL.length; i++) {
      var champData = {
        id: cDL[i].id,
        name: cDL[i].name,
        key: cDL[i].key,
      };
      champDataList.push(champData);
    }
    //#region 챔피언별 밴률
    // Ban
    let banAllData = [];

    for (let i = 0; i < champDataList.length; i++) {
      let bancount = 0;
      for (let j = 0; j < banDataList.length; j++) {
        if (champDataList[i].key == banDataList[j]) bancount++;
      }
      var percent = ((bancount / banDataList.length) * 100).toFixed(2);

      var data = {
        id: champDataList[i].id,
        name: champDataList[i].name,
        count: percent,
      };
      banAllData.push(data);
    }

    // no Ban
    let banNoneCount = 0;
    for (let i = 0; i < banDataList.length; i++) {
      if (banDataList[i] == "-1") banNoneCount++;
    }
    var percent = ((banNoneCount / banDataList.length) * 100).toFixed(2);

    var noBandata = {
      id: "none",
      name: "noBan",
      count: percent,
    };
    banAllData.push(noBandata);
    //#endregion

    //#region 챔피언별 픽률, 승률, 라인, 카운터, 아이템

    //#region  > 픽률
    let champPickData = [];

    console.log(userDataList);

    for (let i = 0; i < champDataList.length; i++) {
      let champCount = 0;
      for (let j = 0; j < userDataList.length; j++) {
        if (champDataList[i].id == userDataList[j].championName) champCount++;
      }
      var percent = ((champCount / userDataList.length) * 100).toFixed(2);

      var data = {
        id: champDataList[i].id,
        name: champDataList[i].name,
        count: percent,
      };

      champPickData.push(data);
    }
    // console.log(champPickData);
    //#endregion 픽률

    //#region  > 승률
    let champWinData = [];

    for (let i = 0; i < champDataList.length; i++) {
      let winCount = 0;
      let pickCount = 0;
      let winVersusList = [];
      let loseVersusList = [];
      for (let j = 0; j < userDataList.length; j++) {
        if (champDataList[i].id == userDataList[j].championName) pickCount++;
        if (
          champDataList[i].id == userDataList[j].championName &&
          userDataList[j].win == true
        ) {
          winVersusList.push(userDataList[j].versus);
          winCount++;
        }
        if (
          champDataList[i].id == userDataList[j].championName &&
          userDataList[j].win == false
        ) {
          loseVersusList.push(userDataList[j].versus);
        }
      }
      var percent = ((winCount / pickCount) * 100).toFixed(2);

      var data = {
        id: champDataList[i].id,
        name: champDataList[i].name,
        winRate: percent,
        winVersus: winVersusList,
        loseVersus: loseVersusList,
      };

      champWinData.push(data);
    }
    console.log(champWinData);
    //#endregion 승률

    //#endregion
  });

//
