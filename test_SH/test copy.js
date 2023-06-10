const apiKey = "RGAPI-6e1b716a-027f-4306-930b-458ee9fb0229	";
const testnick = "Hide on Bush";
const encodedName = encodeURI(testnick);
const SereachByNickStartUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
let UserUrl = SereachByNickStartUrl + encodedName + "?api_key=" + apiKey;
const TierUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/";

let dataSet = new Map();

function loadingData() {
  rawResult = fetch(UserUrl)
  .then((response) => {
    return response.json();
  })
  .then((rawData)=>{
    let data = Object.values(rawData);
    // console.log(data);
    // 0-id 2-puuid 4-icon

    let UidUrl =  TierUrl + data[0] + "?api_key=" + apiKey;
    let MatchUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/"+ data[2]+"/ids?start=0&count=10&api_key="+apiKey;

    var example1 = fetch(UidUrl)
    .then((response1) => {
      return response1.json();
    })
    .then((rawData1)=>{
      return rawData1[0];
    })

    var example2 = fetch(MatchUrl)
    .then((response2) => {
      return response2.json();
    })
    .then(async(rawData2)=>{
      let data2 = Object.values(rawData2);
      // console.log(data2[0]);

      return await fetch("https://asia.api.riotgames.com/lol/match/v5/matches/"+data2[0]+"?api_key="+apiKey)
      .then((response2) => {
        return response2.json();
      })
      .then((rawData2)=>{
        let data2 = Object.values(rawData2);
        // console.log(data2[1]);
        return data2[1];
      })
    })
    dataSet.set('nickname', testnick);
    dataSet.set('id', data[0]);
    dataSet.set('puuid', data[2]);
    dataSet.set('icon', data[4]);

    const getData1 = () => {
      example1.then((appData) => {
        dataSet.set('tier', appData.tier);
        dataSet.set('rank', appData.rank);
        dataSet.set('leaguePoints', appData.leaguePoints);
        dataSet.set('wins', appData.wins);
        dataSet.set('losses', appData.losses);
        dataSet.set('queueType', appData.queueType);
      });
    };
    const getData2 = () => {
      example2.then(async(appData) => {
        // console.log(appData);
        dataSet.set('gameEndTimestamp', appData.gameEndTimestamp);
        dataSet.set('gameDuration', appData.gameDuration);
        var user = new Array();
        for(let i=0;i<10;i++){
          user[i] = new Map();

          user[i].set('championName', appData.participants[i].championName);
          user[i].set('primaryStyle', appData.participants[i].perks.styles[0].style);
          user[i].set('subStyle', appData.participants[i].perks.styles[1].style);
          user[i].set('summoner1Id', appData.participants[i].summoner1Id);
          user[i].set('summoner2Id', appData.participants[i].summoner2Id);
          user[i].set('assists', appData.participants[i].assists);
          user[i].set('deaths', appData.participants[i].deaths);
          user[i].set('kills', appData.participants[i].kills);
          user[i].set('teamId', appData.participants[i].teamId);
          user[i].set('killParticipation', appData.participants[i].challenges.killParticipation);
          user[i].set('cs', appData.participants[i].totalMinionsKilled + appData.participants[0].neutralMinionsKilled);
          user[i].set('item0', appData.participants[i].item0);
          user[i].set('item1', appData.participants[i].item1);
          user[i].set('item2', appData.participants[i].item2);
          user[i].set('item3', appData.participants[i].item3);
          user[i].set('item4', appData.participants[i].item4);
          user[i].set('item5', appData.participants[i].item5);
          user[i].set('item6', appData.participants[i].item6);
          user[i].set('summonerName', appData.participants[i].summonerName);
          user[i].set('wardsPlaced', appData.participants[i].wardsPlaced);//총와드
          user[i].set('visionWardsBoughtInGame', appData.participants[i].visionWardsBoughtInGame);//핑와
          user[i].set('totalDamageDealtToChampions', appData.participants[i].totalDamageDealtToChampions);
          user[i].set('summonerId', appData.participants[i].summonerId);
          user[i].set('champLevel', appData.participants[i].champLevel);
          
          let UidguestUrl =  TierUrl + appData.participants[i].summonerId + "?api_key=" + apiKey;
          var example3 = fetch(UidguestUrl).then((response2) => {
            return response2.json();
          })
          .then((rawData2)=>{
            return (rawData2[0].tier+ " " + rawData2[0].rank);
          })
          getData3 = () => {
            example3.then((appData1) => {
              user[i].set('detailTier', appData1);
            });
          };
          getData3();       
          
          dataSet.set('user', user);   
        }
        // console.log(dataSet); 
      });
    };
    getData1();
    getData2();


    // console.log(dataSet);   
    // var dataEx = document.getElementById("output");
    // dataEx.innerText = dataSet.get('id');
  })
  // console.log(dataSet);
}

loadingData();
setTimeout(function(){
  console.log(dataSet);

  
  const childLi = document.createElement("li");
  const childSpan = document.createElement("span");
  const childImg = document.createElement("img");
  const childDiv = document.createElement("div");

  
  childSpan.appendChild(childImg);
  childSpan.appendChild(childDiv);
  childLi.appendChild(childSpan);
  output.appendChild(childLi);

}, 1000);
// console.log(dataSet);