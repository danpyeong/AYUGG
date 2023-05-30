const apiKey = "RGAPI-847853ca-e3b9-473b-9208-b46d19196339";
const functionCount = 3;
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
  var response = await fetch(tierUserUrl);
  var tierUserRawData = response.json();
  let tierUserList = [];
  // -----promise 객체에서 데이터 뽑아내기
  const tierUserData = tierUserRawData;
  const gettierUserData = () => {
    tierUserData.then(async (rawData) => {
      let data = [];
      let encodedName = [];
      for (let i = 0; i < 10; i++) {
        data.push(Object.values(rawData[i]));
        tierUserList.push(data[i][5]);
        encodedName.push(encodeURI(tierUserList[i]));
      }

      //#region 유저별 puuid
      const uidStartUrl =
        "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
      let uidDataList = [];
      let uidList = [];

      for (let i = 0; i < 10; i++) {
        const uidUrl = uidStartUrl + encodedName[i] + "?api_key=" + apiKey;
        var response = await fetch(uidUrl);
        var uidRawData = response.json();
        uidDataList.push(uidRawData);
        const getUidData = () => {
          uidDataList[i].then(async (rawData) => {
            let data = Object.values(rawData);
            uidList.push(data[2]);
            // console.log(uidList[i]);
          });
        };
        getUidData();
      }
      //#endregion

      //#region 유저당 20개의 matchID 추출
      const matchStartUrl =
        "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/";
      const matchCount = 20;
      let matchList = [];

      for (let i = 0; i < uidList.length; i++) {
        const matchUrl =
          matchStartUrl +
          uidList[i] +
          "/ids?queue=420&start=0&count=" +
          matchCount +
          "&api_key=" +
          apiKey;

        var response = await fetch(matchUrl);
        var matchRawData = response.json();
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
      for (let i = 0; i < 1; i++) {
        const inGameUrl = inGameStartUrl + matchList[i] + "?api_key=" + apiKey;
        var response = await fetch(inGameUrl);
        var inGameRawData = response.json();
        const getInGameData = () => {
          inGameRawData.then(async (rawData) => {
            let data = Object.values(rawData);
            gameDataList.push(Object.values(data[1]));
            // console.log(gameDataList[i]);

            // 유저 10명 list
            userListData = gameDataList[i][10];
            // console.log(userListData);

            let tatalChampionList = [];
            let redChampionNameList = [];
            let blueChampionNameList = [];
            let laneList = [];
            let finallyItemList = [];
            let runeList = [];
            let spellList1 = [];
            let spellList2 = [];

            let user;
            let userList = [];
            for (let i = 0; i < userListData.length; i++) {
              // if (
              //   tatalChampionList.includes(userListData[i].championName) != true
              // ) {
              //   tatalChampionList.push(userListData[i].championName);
              // }
              // if (userListData[i].teamId == 100) {
              //   redChampionNameList.push(userListData[i].championName);
              // } else {
              //   blueChampionNameList.push(userListData[i].championName);
              // }
              // laneList.push(userListData[i].lane);
              // runeList.push(userListData[i].perk);
              // spellList1.push(userListData[i].summoner1Id);
              // spellList2.push(userListData[i].summoner2Id);

              user = [
                { champName: userListData[i].championName },
                { teamId: userListData[i].teamId },
                { lane: userListData[i].lane },
                // {rune : userListData[i].} 좀 더 세분화 시켜야함
                { spell1: userListData[i].summoner1Id },
                { spell2: userListData[i].summoner2Id },
              ];
              userList.push(user);
            }
            console.log(userList);
          });
        };
        getInGameData();
      }
      //#endregion
    });
  };
  gettierUserData();
}

loadData();

// for (let i = 0; i < 1; i++) {
//   let values = userListData[i];
//   let keys = Object.keys(userListData[i]);
//     for (let j = 0; j < keys.length; j++) {
//       var key = keys[j];
//       console.log("key : " + key + "/ value : " + values[key]);
//     }
//   }
