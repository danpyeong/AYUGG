const apiKey = "RGAPI-59bd3bfa-e353-4b80-ba69-7b8ccda9f761";
const testnick = "Hide on Bush";
const encodedName = encodeURI(testnick);
const SereachByNickStartUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
let UserUrl = SereachByNickStartUrl + encodedName + "?api_key=" + apiKey;
const TierUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/";

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
    .then((rawData2)=>{
      let data2 = Object.values(rawData2);
      // console.log(data2[0]);

      return fetch("https://asia.api.riotgames.com/lol/match/v5/matches/"+data2[0]+"?api_key="+apiKey)
      .then((response2) => {
        return response2.json();
      })
      .then((rawData2)=>{
        let data2 = Object.values(rawData2);
        // console.log(data2[1]);
        return data2[1];
      })
    })

    var dataSet = new Map();
    dataSet.set('nickname', testnick);
    dataSet.set('id', data[0]);
    dataSet.set('puuid', data[2]);
    dataSet.set('icon', data[4]);    

    getData1 = () => {
      example1.then((appData) => {
        dataSet.set('tier', appData.tier);
        dataSet.set('rank', appData.rank);
        dataSet.set('leaguePoints', appData.leaguePoints);
        dataSet.set('wins', appData.wins);
        dataSet.set('losses', appData.losses);
        dataSet.set('queueType', appData.queueType);
      });
    };
    getData2 = () => {
      example2.then((appData) => {
        console.log(appData);
        dataSet.set('gameEndTimestamp', appData.gameEndTimestamp);
        dataSet.set('gameDuration', appData.gameDuration);
        for(let i=0;i<10;i++){
          dataSet.set('championName'+ i, appData.participants[i].championName);
          dataSet.set('primaryStyle'+ i, appData.participants[i].perks.styles[0].style);
          dataSet.set('subStyle'+ i, appData.participants[i].perks.styles[1].style);
          dataSet.set('summoner1Id'+ i, appData.participants[i].summoner1Id);
          dataSet.set('summoner2Id'+ i, appData.participants[i].summoner2Id);
          dataSet.set('assists'+ i, appData.participants[i].assists);
          dataSet.set('deaths'+ i, appData.participants[i].deaths);
          dataSet.set('kills'+ i, appData.participants[i].kills);
          dataSet.set('teamId'+ i, appData.participants[i].teamId);
          dataSet.set('killParticipation'+ i, appData.participants[i].challenges.killParticipation);
          dataSet.set('cs'+ i, appData.participants[i].totalMinionsKilled + appData.participants[0].neutralMinionsKilled);
          dataSet.set('item0'+ i, appData.participants[i].item0);
          dataSet.set('item1'+ i, appData.participants[i].item1);
          dataSet.set('item2'+ i, appData.participants[i].item2);
          dataSet.set('item3'+ i, appData.participants[i].item3);
          dataSet.set('item4'+ i, appData.participants[i].item4);
          dataSet.set('item5'+ i, appData.participants[i].item5);
          dataSet.set('item6'+ i, appData.participants[i].item6);
          dataSet.set('summonerName'+ i, appData.participants[i].summonerName);
          dataSet.set('wardsPlaced'+ i, appData.participants[i].wardsPlaced);//총와드
          dataSet.set('visionWardsBoughtInGame'+ i, appData.participants[i].visionWardsBoughtInGame);//핑와
          dataSet.set('totalDamageDealtToChampions'+ i, appData.participants[i].totalDamageDealtToChampions);
          dataSet.set('summonerId'+ i, appData.participants[i].summonerId);
          dataSet.set('champLevel'+ i, appData.participants[i].champLevel);
          
          let UidguestUrl =  TierUrl + appData.participants[i].summonerId + "?api_key=" + apiKey;
          var example3 = fetch(UidguestUrl).then((response2) => {
            return response2.json();
          })
          .then((rawData2)=>{
            return (rawData2[0].tier+ " " + rawData2[0].rank);
          })
          getData3 = () => {
            example3.then((appData1) => {
              dataSet.set('detailTier'+ i, appData1);
            });
          };
          getData3();          
        }
        console.log(dataSet);
      });
    };
    getData1();
    getData2();

  })
}

loadingData();