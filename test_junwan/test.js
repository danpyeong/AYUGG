const apiKey = "RGAPI-6e1b716a-027f-4306-930b-458ee9fb0229";

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
  const gettierUserData = () => {
    tierUserRawData.then(async (rawData) => {
      let data = [];
      let encodedName = [];
      //  tierUserList에 담긴 205명 중 10명만 - 최대 : i < data.length
      for (let i = 0; i < data.length; i++) {
        data.push(Object.values(rawData[i]));
        tierUserList.push(data[i][5]);
        encodedName.push(encodeURI(data[i][5]));
      }

      //#region 유저별 puuid
      const uidStartUrl =
        "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
      let uidDataList = [];
      let uidList = [];

      for (let i = 0; i < encodedName.length; i++) {
        const uidUrl = uidStartUrl + encodedName[i] + "?api_key=" + apiKey;
        var uidUrlResponse = await fetch(uidUrl);
        var uidRawData = uidUrlResponse.json();
        uidDataList.push(uidRawData);
        const getUidData = () => {
          uidDataList[i].then(async (rawData) => {
            let data = Object.values(rawData);
            uidList.push(data[2]);
          });
        };
        getUidData();
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
        const getMatchData = () => {
          matchRawData.then(async (rawData) => {
            let data = Object.values(rawData);
            for (let i = 0; i < data.length; i++) {
              if (matchList.includes(data[i]) == false) {
                matchList.push(data[i]);
              }
            }
          });
        };
        getMatchData();
      }
      //#endregion

      //#region matchList를 이용해서 게임 내역을 받고 거기서 데이터 빼오기
      const inGameStartUrl =
        "https://asia.api.riotgames.com/lol/match/v5/matches/";

      let gameDataList = [];
      let userListData = [];
      let userList = [];
      let banChampionIdList = [];

      for (let i = 0; i < 5; i++) {
        const inGameUrl = inGameStartUrl + matchList[i] + "?api_key=" + apiKey;
        var inGameUrlResponse = await fetch(inGameUrl);
        var inGameRawData = inGameUrlResponse.json();
        const getInGameData = () => {
          inGameRawData.then(async (rawData) => {
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
              //#region runeMap
              const statsMap = new Map();
              statsMap.set("defense", userListData[i].perks.statPerks.defense);
              statsMap.set("flex", userListData[i].perks.statPerks.flex);
              statsMap.set("offense", userListData[i].perks.statPerks.offense);

              const mainRuneMap = new Map();
              mainRuneMap.set(
                "styleRune",
                userListData[i].perks.styles[0].style
              );
              mainRuneMap.set(
                "titleRune",
                userListData[i].perks.styles[0].selections[0].perk
              );
              mainRuneMap.set(
                "firstRune",
                userListData[i].perks.styles[0].selections[1].perk
              );
              mainRuneMap.set(
                "secondRune",
                userListData[i].perks.styles[0].selections[2].perk
              );
              mainRuneMap.set(
                "thirdRune",
                userListData[i].perks.styles[0].selections[3].perk
              );

              const subRuneMap = new Map();
              subRuneMap.set(
                "styleRune",
                userListData[i].perks.styles[1].style
              );
              subRuneMap.set(
                "firstRune",
                userListData[i].perks.styles[1].selections[0].perk
              );
              subRuneMap.set(
                "secondRune",
                userListData[i].perks.styles[1].selections[1].perk
              );

              const runeMap = new Map();
              runeMap.set("stats", statsMap);
              runeMap.set("mainRune", mainRuneMap);
              runeMap.set("subRune", subRuneMap);
              //#endregion

              //#region spellMap
              const spellMap = new Map();
              spellMap.set("spell1", userListData[i].summoner1Id);
              spellMap.set("spell2", userListData[i].summoner2Id);
              //#endregion

              //#region itemMap
              const itemMap = new Map();
              itemMap.set("item1", userListData[i].item0);
              itemMap.set("item2", userListData[i].item1);
              itemMap.set("item3", userListData[i].item2);
              itemMap.set("item4", userListData[i].item3);
              itemMap.set("item5", userListData[i].item4);
              itemMap.set("item6", userListData[i].item5);
              itemMap.set("item7", userListData[i].item6);
              //#endregion

              //#region userMap
              const userMap = new Map();
              userMap.set("championName", userListData[i].championName);
              userMap.set(
                "versusChampionName",
                userListData[Math.abs(i - 5)].championName
              );
              userMap.set("teamId", userListData[i].teamId);
              userMap.set("lane", userListData[i].teamPosition);
              userMap.set("rune", runeMap);
              userMap.set("spell", spellMap);
              userMap.set("item", itemMap);
              userMap.set("win", userListData[i].win);
              //#endregion

              userList.push(userMap);
            }
          });
        };
        getInGameData();
      }
      //#endregion
      console.log(banChampionIdList);
      console.log(userList);

      // setTimeout(function () {
      //   console.log(championKeyList);
      //   console.log(championNameList);
      // }, 10);

      //#endregion

      // 챔피언 확률 계산
      let pickCount;
      let pickChampionRate;
      let banCount;
      let banChampionRate;
      // for (let i = 0; i < banChampionIdList.length; i++) {
      //   for (let j = 0; i < banChampionIdList.length; j++) {}
      //   console.log(userList[0].get("championName"));
      // }
      // var items = localStorage.getItem("aaaa");
      // if (!items) {
      //   // API로 가져옴
      //   items = [];
      //   localStorage.setItem("aaaa", JSON.stringify(items));
      // } else {
      //   items = JSON.parse(items);
      // }
    });
  };
  gettierUserData();
}
loadData();

// test
