const apiKey = "RGAPI-4624feaa-1d58-4aab-be76-e920e419f2a9";
const functionCount = 3;
// 티어별 유저 정보
const tierUserStartUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/";
const division = ["I", "II", "III", "IV"];
const tier = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
const queue = ["RANKED_SOLO_5x5", "RANKED_FLEX_SR", "RANKED_FLEX_TT"];
const page = "?page=";

let tierUserUrl =
  tierUserStartUrl +
  queue[0] +
  "/" +
  tier[4] +
  "/" +
  division[0] +
  page +
  "250" +
  "&api_key=" +
  apiKey;

// 유저 정보별 puuid
const puuidStartUrl =
  "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
let userName = [];

// 변수
let summeronerpuuIdList = [];
let summeronerNameList = [];
let puuidUrlList = [];
let puuidList = [];

function getUser() {
  const response = fetch(tierUserUrl, {
    method: "GET",
  });
  // console.log(response);
  return response;
}

async function exec() {
  var text;
  try {
    text = await getUser();
    console.log(text.json());
  } catch (error) {
    console.log(error);
  }
}

exec();

// getUser()
//   .then((res) => res.json())
//   .then((data) => {
//     let matchRawData = Object.values(data);

//     // 티어별 소환사ID 추출
//     for (let i = 0; i < functionCount; i++) {
//       summeronerNameList[i] = Object.values(matchRawData[i])[5];
//     }

//     console.log(summeronerNameList);
//     return summeronerNameList;
//   });
// summeronerNameList = getUser();
// console.log(summeronerNameList);

const tierResponse = fetch(tierUserUrl, {
  method: "GET",
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // console.log(data);

    let matchRawData = Object.values(data);

    // 티어별 소환사ID 추출
    for (let i = 0; i < functionCount; i++) {
      summeronerNameList[i] = Object.values(matchRawData[i])[5];
    }

    // console.log(summeronerNameList);

    // // 얻어낸 소환사ID로 최근 게임 추출
    // for (let i = 0; i < functionCount; i++) {
    //   userName[i] = encodeURI(summeronerNameList[i]);

    //   let puuidUrl = puuidStartUrl + userName[i] + "?api_key=" + apiKey;
    //   puuidUrlList[i] = puuidUrl;
    //   // console.log(puuidUrlList[i]);

    //   // puuid 얻고 리스트에 담기
    //   function getPuuid() {
    //     fetch(puuidUrlList[i], {
    //       method: "GET",
    //     })
    //       .then((response) => {
    //         return response.json();
    //       })
    //       .then((data) => {
    //         puuidList = Object.values(data)[2];
    //         console.log(puuidList);
    //       });
    //   }
    //   getPuuid();
    // }
  });

// console.log(tierResponse);

// const tierResult = tierResponse.json();
// console.log(tierResult);

// 유저별 최근 3게임 정보
// 순서 : 기본주소 + puuid + "ids?" + Start

const matchStartUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/";
let matchCount;
const matchUrl =
  matchStartUrl + "puuid" + "/ids?Start-0&count" + matchCount + "&api_key=";

function getMatch() {
  // console.log(puuidList);
}
getMatch();

// fetch 기본 구조

// function example() {
// fetch('', {
//   method: 'GET',
// })
// .then(response => {
//   return response.json();
// })
// .then(data => {
//   console.log(data);
//   });
// }
// example();
