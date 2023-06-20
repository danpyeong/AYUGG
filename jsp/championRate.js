const apiKey = "RGAPI-2bf344d0-b611-4f82-af11-d70e7c1baee1";

// const version = "https://ddragon.leagueoflegends.com/cdn/13.10.1/";
// const championUrl = version + "data/ko_KR/champion.json";

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

            //#region  유저 게임 데이터
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
            }
          });
        };
        await getInGameData();
      }
      console.log(userList);
      //#endregion

      //#region localStorage 입력
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
      //#endregion
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

//#region userList, banLIst sort() 및 정리
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
      var banRate = ((bancount / banDataList.length) * 100).toFixed(2);

      var data = {
        id: champDataList[i].id,
        name: champDataList[i].name,
        banData: banRate,
      };
      banAllData.push(data);
    }
    console.log(banAllData);
    //#endregion

    //#region 챔피언별 픽률, 승률, 라인, 카운터, 아이템

    //#region  > 픽률,  승률
    let champRateData = [];
    for (let i = 0; i < champDataList.length; i++) {
      //#region 변수
      // userDataList[j]의 챔피언 닉이 현재 챔피언과 동일하면 pickCount++
      let allPickCount = 0;
      //#region  > 라인 카운트
      let countTOP = 0;
      let countJUG = 0;
      let countMID = 0;
      let countBOT = 0;
      let countSUP = 0;
      //#endregion  라인 카운트

      //#region  > 라인 별 상대 챔
      let verTOP = [];
      let verJUG = [];
      let verMID = [];
      let verBOT = [];
      let verSUP = [];
      //#endregion  라인 별 상대 챔
      //#endregion 변수

      //#region 챔피언 마다 라인 별로 나누기
      for (let j = 0; j < userDataList.length; j++) {
        if (champDataList[i].id == userDataList[j].championName) {
          allPickCount++;
          if (userDataList[j].lane == "TOP") {
            countTOP++;
            var matchData = {
              verName: userDataList[j].versus,
              win: userDataList[j].win,
              item: {
                item0: userDataList[j].item.item0,
                item1: userDataList[j].item.item1,
                item2: userDataList[j].item.item2,
                item3: userDataList[j].item.item3,
                item4: userDataList[j].item.item4,
                item5: userDataList[j].item.item5,
                item6: userDataList[j].item.item6,
              },
              spell: {
                spell1: userDataList[j].spell.spell1,
                spell2: userDataList[j].spell.spell2,
              },
              rune: {
                mainRune: {
                  styleRune: userDataList[j].rune.mainRune.styleRune,
                  titleRune: userDataList[j].rune.mainRune.titleRune,
                  firstRune: userDataList[j].rune.mainRune.firstRune,
                  secondRune: userDataList[j].rune.mainRune.secondRune,
                  thirdRune: userDataList[j].rune.mainRune.thirdRune,
                },
                subRune: {
                  styleRune: userDataList[j].rune.subRune.styleRune,
                  firstRune: userDataList[j].rune.subRune.firstRune,
                  secondRune: userDataList[j].rune.subRune.secondRune,
                },
                stats: {
                  defense: userDataList[j].rune.stats.defense,
                  flex: userDataList[j].rune.stats.flex,
                  offense: userDataList[j].rune.stats.offense,
                },
              },
            };
            verTOP.push(matchData);
          } else if (userDataList[j].lane == "JUNGLE") {
            countJUG++;
            var matchData = {
              verName: userDataList[j].versus,
              win: userDataList[j].win,
              item: {
                item0: userDataList[j].item.item0,
                item1: userDataList[j].item.item1,
                item2: userDataList[j].item.item2,
                item3: userDataList[j].item.item3,
                item4: userDataList[j].item.item4,
                item5: userDataList[j].item.item5,
                item6: userDataList[j].item.item6,
              },
              spell: {
                spell1: userDataList[j].spell.spell1,
                spell2: userDataList[j].spell.spell2,
              },
              rune: {
                mainRune: {
                  styleRune: userDataList[j].rune.mainRune.styleRune,
                  titleRune: userDataList[j].rune.mainRune.titleRune,
                  firstRune: userDataList[j].rune.mainRune.firstRune,
                  secondRune: userDataList[j].rune.mainRune.secondRune,
                  thirdRune: userDataList[j].rune.mainRune.thirdRune,
                },
                subRune: {
                  styleRune: userDataList[j].rune.subRune.styleRune,
                  firstRune: userDataList[j].rune.subRune.firstRune,
                  secondRune: userDataList[j].rune.subRune.secondRune,
                },
                stats: {
                  defense: userDataList[j].rune.stats.defense,
                  flex: userDataList[j].rune.stats.flex,
                  offense: userDataList[j].rune.stats.offense,
                },
              },
            };
            verJUG.push(matchData);
          } else if (userDataList[j].lane == "MIDDLE") {
            countMID++;
            var matchData = {
              verName: userDataList[j].versus,
              win: userDataList[j].win,
              item: {
                item0: userDataList[j].item.item0,
                item1: userDataList[j].item.item1,
                item2: userDataList[j].item.item2,
                item3: userDataList[j].item.item3,
                item4: userDataList[j].item.item4,
                item5: userDataList[j].item.item5,
                item6: userDataList[j].item.item6,
              },
              spell: {
                spell1: userDataList[j].spell.spell1,
                spell2: userDataList[j].spell.spell2,
              },
              rune: {
                mainRune: {
                  styleRune: userDataList[j].rune.mainRune.styleRune,
                  titleRune: userDataList[j].rune.mainRune.titleRune,
                  firstRune: userDataList[j].rune.mainRune.firstRune,
                  secondRune: userDataList[j].rune.mainRune.secondRune,
                  thirdRune: userDataList[j].rune.mainRune.thirdRune,
                },
                subRune: {
                  styleRune: userDataList[j].rune.subRune.styleRune,
                  firstRune: userDataList[j].rune.subRune.firstRune,
                  secondRune: userDataList[j].rune.subRune.secondRune,
                },
                stats: {
                  defense: userDataList[j].rune.stats.defense,
                  flex: userDataList[j].rune.stats.flex,
                  offense: userDataList[j].rune.stats.offense,
                },
              },
            };
            verMID.push(matchData);
          } else if (userDataList[j].lane == "BOTTOM") {
            countBOT++;
            var matchData = {
              verName: userDataList[j].versus,
              win: userDataList[j].win,
              item: {
                item0: userDataList[j].item.item0,
                item1: userDataList[j].item.item1,
                item2: userDataList[j].item.item2,
                item3: userDataList[j].item.item3,
                item4: userDataList[j].item.item4,
                item5: userDataList[j].item.item5,
                item6: userDataList[j].item.item6,
              },
              spell: {
                spell1: userDataList[j].spell.spell1,
                spell2: userDataList[j].spell.spell2,
              },
              rune: {
                mainRune: {
                  styleRune: userDataList[j].rune.mainRune.styleRune,
                  titleRune: userDataList[j].rune.mainRune.titleRune,
                  firstRune: userDataList[j].rune.mainRune.firstRune,
                  secondRune: userDataList[j].rune.mainRune.secondRune,
                  thirdRune: userDataList[j].rune.mainRune.thirdRune,
                },
                subRune: {
                  styleRune: userDataList[j].rune.subRune.styleRune,
                  firstRune: userDataList[j].rune.subRune.firstRune,
                  secondRune: userDataList[j].rune.subRune.secondRune,
                },
                stats: {
                  defense: userDataList[j].rune.stats.defense,
                  flex: userDataList[j].rune.stats.flex,
                  offense: userDataList[j].rune.stats.offense,
                },
              },
            };
            verBOT.push(matchData);
          } else if (userDataList[j].lane == "UTILITY") {
            countSUP++;
            var matchData = {
              verName: userDataList[j].versus,
              win: userDataList[j].win,
              item: {
                item0: userDataList[j].item.item0,
                item1: userDataList[j].item.item1,
                item2: userDataList[j].item.item2,
                item3: userDataList[j].item.item3,
                item4: userDataList[j].item.item4,
                item5: userDataList[j].item.item5,
                item6: userDataList[j].item.item6,
              },
              spell: {
                spell1: userDataList[j].spell.spell1,
                spell2: userDataList[j].spell.spell2,
              },
              rune: {
                mainRune: {
                  styleRune: userDataList[j].rune.mainRune.styleRune,
                  titleRune: userDataList[j].rune.mainRune.titleRune,
                  firstRune: userDataList[j].rune.mainRune.firstRune,
                  secondRune: userDataList[j].rune.mainRune.secondRune,
                  thirdRune: userDataList[j].rune.mainRune.thirdRune,
                },
                subRune: {
                  styleRune: userDataList[j].rune.subRune.styleRune,
                  firstRune: userDataList[j].rune.subRune.firstRune,
                  secondRune: userDataList[j].rune.subRune.secondRune,
                },
                stats: {
                  defense: userDataList[j].rune.stats.defense,
                  flex: userDataList[j].rune.stats.flex,
                  offense: userDataList[j].rune.stats.offense,
                },
              },
            };
            verSUP.push(matchData);
          }
        }
      }
      let laneDetailData = {
        id: champDataList[i].id,
        name: champDataList[i].name,
        allCount: allPickCount,
        top: {
          count: countTOP,
          data: verTOP,
        },
        jug: {
          count: countJUG,
          data: verJUG,
        },
        mid: {
          count: countMID,
          data: verMID,
        },
        bot: {
          count: countBOT,
          data: verBOT,
        },
        sup: {
          count: countSUP,
          data: verSUP,
        },
      };
      //#endregion 챔피언 마다 라인 별로 나누기

      var laneTOP = undefined;
      var laneJUG = undefined;
      var laneMID = undefined;
      var laneBOT = undefined;
      var laneSUP = undefined;
      var banData = "";

      //#region 라인 별 챔피언 RATE
      //#region   > 변수
      var top = laneDetailData.top;
      var jug = laneDetailData.jug;
      var mid = laneDetailData.mid;
      var bot = laneDetailData.bot;
      var sup = laneDetailData.sup;
      //#endregion 변수

      for (let k = 0; k < banAllData.length; k++) {
        if (champDataList[i].id == banAllData[k].id) {
          banData = banAllData[k].banData;
          break;
        }
      }

      function sortWinRateList(list) {
        list.sort(function (a, b) {
          var aNum = parseFloat(a.winRate);
          var bNum = parseFloat(b.winRate);
          return aNum - bNum;
        });
        return list;
      }

      //#region   > 탑
      if (top.count != 0) {
        // 해당 라인에서의 픽률
        var pickPer = ((top.count / userDataList.length) * 100).toFixed(2);

        var versus = [];
        for (let k = 0; k < top.data.length; k++) {
          if (!versus.includes(top.data[k].verName)) {
            versus.push(top.data[k].verName);
          }
        }

        var win = 0;
        var versusDataList = [];
        for (let k = 0; k < versus.length; k++) {
          var versusCount = 0;
          var winCount = 0;
          for (let x = 0; x < top.data.length; x++) {
            if (versus[k] == top.data[x].verName) {
              versusCount++;
              if (top.data[x].win == true) {
                winCount++;
                win++;
              }
            }
          }
          var winRate = ((winCount / versusCount) * 100).toFixed(2);

          var data = {
            id: versus[k],
            winRate: winRate,
          };
          versusDataList.push(data);
        }

        sortWinRateList(versusDataList);
        // 해당 라인에서의 승률
        var winPer = ((win / top.data.length) * 100).toFixed(2);
        var detailRateData = {
          id: champDataList[i].id,
          name: champDataList[i].name,
          pickRate: pickPer,
          banRate: banData,
          winRate: winPer,
          counter: versusDataList,
        };
        laneTOP = detailRateData;
      }
      //#endregion 탑

      //#region   > 정글
      if (jug.count != 0) {
        // 해당 라인에서의 픽률
        var pickPer = ((jug.count / userDataList.length) * 100).toFixed(2);

        var win = 0;
        var versus = [];
        for (let k = 0; k < jug.data.length; k++) {
          if (!versus.includes(jug.data[k].verName)) {
            versus.push(jug.data[k].verName);
          }
        }

        var versusDataList = [];
        for (let k = 0; k < versus.length; k++) {
          var versusCount = 0;
          var winCount = 0;
          for (let x = 0; x < jug.data.length; x++) {
            if (versus[k] == jug.data[x].verName) {
              versusCount++;
              if (jug.data[x].win == true) {
                winCount++;
                win++;
              }
            }
          }
          var winRate = ((winCount / versusCount) * 100).toFixed(2);
          var data = {
            id: versus[k],
            winRate: winRate,
          };
          versusDataList.push(data);
        }
        sortWinRateList(versusDataList);
        // 해당 라인에서의 승률
        var winPer = ((win / jug.data.length) * 100).toFixed(2);

        var detailRateData = {
          id: champDataList[i].id,
          name: champDataList[i].name,
          pickRate: pickPer,
          banRate: banData,
          winRate: winPer,
          counter: versusDataList,
        };
        laneJUG = detailRateData;
      }
      //#endregion 정글

      //#region   > 미드
      if (mid.count != 0) {
        // 해당 라인에서의 픽률
        var pickPer = ((mid.count / userDataList.length) * 100).toFixed(2);

        var win = 0;
        var versus = [];
        for (let k = 0; k < mid.data.length; k++) {
          if (!versus.includes(mid.data[k].verName)) {
            versus.push(mid.data[k].verName);
          }
        }

        var versusDataList = [];
        for (let k = 0; k < versus.length; k++) {
          var versusCount = 0;
          var winCount = 0;
          for (let x = 0; x < mid.data.length; x++) {
            if (versus[k] == mid.data[x].verName) {
              versusCount++;
              if (mid.data[x].win == true) {
                winCount++;
                win++;
              }
            }
          }
          var winRate = ((winCount / versusCount) * 100).toFixed(2);
          var data = {
            id: versus[k],
            winRate: winRate,
          };
          versusDataList.push(data);
        }
        sortWinRateList(versusDataList);
        // 해당 라인에서의 승률
        var winPer = ((win / mid.data.length) * 100).toFixed(2);

        var detailRateData = {
          id: champDataList[i].id,
          name: champDataList[i].name,
          pickRate: pickPer,
          banRate: banData,
          winRate: winPer,
          counter: versusDataList,
        };
        laneMID = detailRateData;
      }
      //#endregion 미드

      //#region   > 원딜
      if (bot.count != 0) {
        // 해당 라인에서의 픽률
        var pickPer = ((bot.count / userDataList.length) * 100).toFixed(2);

        var win = 0;
        var versus = [];
        for (let k = 0; k < bot.data.length; k++) {
          if (!versus.includes(bot.data[k].verName)) {
            versus.push(bot.data[k].verName);
          }
        }

        var versusDataList = [];
        for (let k = 0; k < versus.length; k++) {
          var versusCount = 0;
          var winCount = 0;
          for (let x = 0; x < bot.data.length; x++) {
            if (versus[k] == bot.data[x].verName) {
              versusCount++;
              if (bot.data[x].win == true) {
                winCount++;
                win++;
              }
            }
          }
          var winRate = ((winCount / versusCount) * 100).toFixed(2);
          var data = {
            id: versus[k],
            winRate: winRate,
          };
          versusDataList.push(data);
        }
        sortWinRateList(versusDataList);
        // 해당 라인에서의 승률
        var winPer = ((win / bot.data.length) * 100).toFixed(2);

        var detailRateData = {
          id: champDataList[i].id,
          name: champDataList[i].name,
          pickRate: pickPer,
          banRate: banData,
          winRate: winPer,
          counter: versusDataList,
        };
        laneBOT = detailRateData;
      }
      //#endregion 원딜

      //#region   > 서폿
      if (sup.count != 0) {
        // 해당 라인에서의 픽률
        var pickPer = ((sup.count / userDataList.length) * 100).toFixed(2);

        var win = 0;
        var versus = [];
        for (let k = 0; k < sup.data.length; k++) {
          if (!versus.includes(sup.data[k].verName)) {
            versus.push(sup.data[k].verName);
          }
        }

        var versusDataList = [];
        for (let k = 0; k < versus.length; k++) {
          var versusCount = 0;
          var winCount = 0;
          for (let x = 0; x < sup.data.length; x++) {
            if (versus[k] == sup.data[x].verName) {
              versusCount++;
              if (sup.data[x].win == true) {
                winCount++;
                win++;
              }
            }
          }
          var winRate = ((winCount / versusCount) * 100).toFixed(2);
          var data = {
            id: versus[k],
            winRate: winRate,
          };
          versusDataList.push(data);
        }
        sortWinRateList(versusDataList);
        // 해당 라인에서의 승률
        var winPer = ((win / sup.data.length) * 100).toFixed(2);

        var detailRateData = {
          id: champDataList[i].id,
          name: champDataList[i].name,
          pickRate: pickPer,
          banRate: banData,
          winRate: winPer,
          counter: versusDataList,
        };
        laneSUP = detailRateData;
      }
      //#endregion 서폿
      //#endregion 라인 별 챔피언 RATE

      var data = {
        id: champDataList[i].id,
        name: champDataList[i].name,
        lane: {
          TOP: laneTOP,
          JUNGLE: laneJUG,
          MIDDLE: laneMID,
          BOTTOM: laneBOT,
          UTILITY: laneSUP,
        },
      };

      champRateData.push(data);
    }
    //#endregion 픽률, 승률

    //#region  > 라인 별 챔프
    let allRateDataList = [];
    let topLaneList = [];
    let jugLaneList = [];
    let midLaneList = [];
    let botLaneList = [];
    let supLaneList = [];
    console.log(champRateData);
    for (let i = 0; i < champRateData.length; i++) {
      var lane = champRateData[i].lane;
      if (lane.TOP != undefined) {
        if (lane.TOP.winRate != "0.00") topLaneList.push(lane.TOP);
      }
      if (lane.JUNGLE != undefined) {
        if (lane.JUNGLE.winRate != "0.00") jugLaneList.push(lane.JUNGLE);
      }
      if (lane.MIDDLE != undefined) {
        if (lane.MIDDLE.winRate != "0.00") midLaneList.push(lane.MIDDLE);
      }
      if (lane.BOTTOM != undefined) {
        if (lane.BOTTOM.winRate != "0.00") botLaneList.push(lane.BOTTOM);
      }
      if (lane.UTILITY != undefined) {
        if (lane.UTILITY.winRate != "0.00") supLaneList.push(lane.UTILITY);
      }
    }
    //#endregion 라인 별 챔프

    //#region   > 픽률로 내림차순 <
    function reverseList(list) {
      list.sort(function (a, b) {
        var aNum = parseFloat(a.pickRate);
        var bNum = parseFloat(b.pickRate);
        return aNum - bNum;
      });
      var reverse = list.reverse();
      return reverse;
    }

    reverseList(topLaneList);
    reverseList(jugLaneList);
    reverseList(midLaneList);
    reverseList(botLaneList);
    reverseList(supLaneList);
    //#endregion > 픽률로 내림차순 <

    allRateDataList.push(topLaneList);
    allRateDataList.push(jugLaneList);
    allRateDataList.push(midLaneList);
    allRateDataList.push(botLaneList);
    allRateDataList.push(supLaneList);
    //#endregion 챔피언별 픽률, 승률, 라인, 카운터, 아이템

    //#region   > table <
    const championTable = document.createElement("table");
    championTable.className = "champions-table";

    //#region    >> colgroup <<
    const colgroup = document.createElement("colgroup");
    championTable.appendChild(colgroup);

    const col0 = document.createElement("col");
    col0.width = "70px";
    const col1 = document.createElement("col");
    col1.width = "200px";
    const col2 = document.createElement("col");
    col2.width = "60px";
    const col3 = document.createElement("col");
    col3.width = "60px";
    const col4 = document.createElement("col");
    col4.width = "60px";
    const col5 = document.createElement("col");
    col5.width = "60px";
    const col6 = document.createElement("col");
    col6.width = "150px";

    colgroup.appendChild(col0);
    colgroup.appendChild(col1);
    colgroup.appendChild(col2);
    colgroup.appendChild(col3);
    colgroup.appendChild(col4);
    colgroup.appendChild(col5);
    colgroup.appendChild(col6);
    //#endregion   >> colgroup

    //#region    >> thead <<
    const thead = document.createElement("thead");
    championTable.appendChild(thead);

    const theadTH0 = document.createElement("th");
    theadTH0.align = "middle";
    theadTH0.innerText = "순위";
    const theadTH1 = document.createElement("th");
    theadTH1.align = "middle";
    theadTH1.innerText = "챔피언";
    const theadTH2 = document.createElement("th");
    theadTH2.align = "middle";
    theadTH2.innerText = "티어";
    const theadTH3 = document.createElement("th");
    theadTH3.align = "middle";
    theadTH3.innerText = "승률";
    const theadTH4 = document.createElement("th");
    theadTH4.align = "middle";
    theadTH4.innerText = "픽률";
    const theadTH5 = document.createElement("th");
    theadTH5.align = "middle";
    theadTH5.innerText = "밴률";
    const theadTH6 = document.createElement("th");
    theadTH6.align = "middle";
    theadTH6.innerText = "카운터";

    thead.appendChild(theadTH0);
    thead.appendChild(theadTH1);
    thead.appendChild(theadTH2);
    thead.appendChild(theadTH3);
    thead.appendChild(theadTH4);
    thead.appendChild(theadTH5);
    thead.appendChild(theadTH6);
    //#endregion   >> thead

    //#region    >> tbody <<
    const tbody = document.createElement("tbody");

    function laneStats(lane) {
      for (let i = 0; i < lane.length; i++) {
        const tbodyTR = document.createElement("tr");
        // >>> 1) 순위 <<<
        const rankTD = document.createElement("td");
        rankTD.className = "first-child";
        const rankDiv1 = document.createElement("div");
        rankDiv1.id = "rankDiv1";
        rankDiv1.className = "first-child-div-1";
        rankDiv1.innerText = i + 1;
        const rankDiv2 = document.createElement("div");
        rankDiv2.id = "rankDiv2";
        rankDiv2.className = "first-child-div-2";
        rankDiv2.innerText = "-";

        rankTD.appendChild(rankDiv1);
        rankTD.appendChild(rankDiv2);

        tbodyTR.appendChild(rankTD);

        // >>> 2) 챔피언 이미지 및 이름 <<<
        const champTD = document.createElement("td");
        const champDIV = document.createElement("div");
        const champIMG = document.createElement("img");
        champIMG.src =
          "http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/" +
          lane[i].id +
          ".png";
        // champIMG.style.borderRadius = "50%";
        const champNAME = document.createElement("span");
        champNAME.innerText = lane[i].name;

        champDIV.appendChild(champIMG);
        champDIV.appendChild(champNAME);
        champTD.appendChild(champDIV);

        tbodyTR.appendChild(champTD);

        // >>> 3~6) 티어, 승률, 픽률, 밴률 <<<
        const tierTD = document.createElement("td");
        tierTD.innerText = "-";
        const winRateTD = document.createElement("td");
        winRateTD.innerText = lane[i].winRate;
        const pickRateTD = document.createElement("td");
        pickRateTD.innerText = lane[i].pickRate;
        const banRateTD = document.createElement("td");
        banRateTD.innerText = lane[i].banRate;

        tbodyTR.appendChild(tierTD);
        tbodyTR.appendChild(winRateTD);
        tbodyTR.appendChild(pickRateTD);
        tbodyTR.appendChild(banRateTD);

        // >>> 7) 카운터 <<<
        const counterTD = document.createElement("td");
        const counterBOX = document.createElement("div");
        counterBOX.className = "counter";
        counterBOX.style.display = "flex";
        counterBOX.style.justifyContent = "center";
        const counterIMG1 = document.createElement("img");
        counterIMG1.style.marginRight = "10px";
        if (lane[i].counter.length > 0) {
          counterIMG1.src =
            "http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/" +
            lane[i].counter[0].id +
            ".png";
          counterIMG1.style.borderRadius = "50%";
        }
        const counterIMG2 = document.createElement("img");
        counterIMG2.style.marginRight = "10px";
        if (lane[i].counter.length > 1) {
          counterIMG2.src =
            "http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/" +
            lane[i].counter[1].id +
            ".png";
          counterIMG2.style.borderRadius = "50%";
        }
        const counterIMG3 = document.createElement("img");
        if (lane[i].counter.length > 2) {
          counterIMG3.src =
            "http://ddragon.leagueoflegends.com/cdn/13.11.1/img/champion/" +
            lane[i].counter[2].id +
            ".png";
          counterIMG3.style.borderRadius = "50%";
        }
        counterBOX.appendChild(counterIMG1);
        counterBOX.appendChild(counterIMG2);
        counterBOX.appendChild(counterIMG3);
        counterTD.appendChild(counterBOX);

        tbodyTR.appendChild(counterTD);
        tbody.appendChild(tbodyTR);
      }
    }

    function clearTBODY(table, tbody) {
      let size = tbody.rows.length;
      for (let i = 0; i < size; i++) {
        tbody.deleteRow(tbody.rows[i]);
      }
      table.removeChild(tbody);
    }

    laneStats(topLaneList);
    championTable.appendChild(tbody);

    const championDivBox = document.getElementById("championBox");
    championDivBox.appendChild(championTable);
    //#endregion   >> tbody

    //#endregion  > table
    // ㅇㅇ
    const topButton = document.getElementById("line-top");
    const jugButton = document.getElementById("line-jg");
    const midButton = document.getElementById("line-mid");
    const botButton = document.getElementById("line-bot");
    const supButton = document.getElementById("line-sup");
    let lineButton = [];

    lineButton.push(topButton);
    lineButton.push(jugButton);
    lineButton.push(midButton);
    lineButton.push(botButton);
    lineButton.push(supButton);

    for (let i = 0; i < lineButton.length; i++) {
      lineButton[i].addEventListener("click", function (e) {
        clearTBODY(championTable, tbody);
        laneStats(allRateDataList[i]);
        championTable.appendChild(tbody);
        championDivBox.appendChild(championTable);

        for (let j = 0; j < lineButton.length; j++) {
          if (lineButton[i] == lineButton[j]) {
            // background-color: rgb(76, 76, 246);
            // color: #fff;
            lineButton[j].style.backgroundColor = "rgb(76, 76, 246)";
            lineButton[j].style.color = "#fff";
          } else {
            lineButton[j].style.backgroundColor = "#fff";
            lineButton[j].style.color = "#000000";
          }
        }
      });
    }

    // topButton.addEventListener("click", function (e) {
    //   clearTBODY(championTable, tbody);
    //   laneStats(topLaneList);
    //   championTable.appendChild(tbody);
    //   championDivBox.appendChild(championTable);
    // });

    // jugButton.addEventListener("click", function (e) {
    //   clearTBODY(championTable, tbody);
    //   laneStats(jugLaneList);
    //   championTable.appendChild(tbody);
    //   championDivBox.appendChild(championTable);
    // });

    // midButton.addEventListener("click", function (e) {
    //   clearTBODY(championTable, tbody);
    //   laneStats(midLaneList);
    //   championTable.appendChild(tbody);
    //   championDivBox.appendChild(championTable);
    // });

    // botButton.addEventListener("click", function (e) {
    //   clearTBODY(championTable, tbody);
    //   laneStats(botLaneList);
    //   championTable.appendChild(tbody);
    //   championDivBox.appendChild(championTable);
    // });

    // supButton.addEventListener("click", function (e) {
    //   clearTBODY(championTable, tbody);
    //   laneStats(supLaneList);
    //   championTable.appendChild(tbody);
    //   championDivBox.appendChild(championTable);
    // });
  });
