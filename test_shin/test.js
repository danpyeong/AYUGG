const apiKey = "RGAPI-1ace2ecc-1c17-4ece-9c82-60b963cef222";
const testnick = "Hide on Bush";
const encodedName = encodeURI(testnick);
const SereachByNickStartUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
let UserUrl = SereachByNickStartUrl + encodedName + "?api_key=" + apiKey;
const TierUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/";

fetch(UserUrl)
  .then((response) => {
    return response.json();
  })
  .then((rawData)=>{
    let data = Object.values(rawData);
    // 0-id 1-accountid 2-puuid 4-icon 6-level

    let UidUrl =  TierUrl + data[0] + "?api_key=" + apiKey;
    // console.log(data[2]);
    let MatchUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/"+ data[2]+"/ids?start=0&count=10&api_key="+apiKey;

    fetch(UidUrl)
    .then((response1) => {
      return response1.json();
    })
    .then((rawData1)=>{
      let data1 = Object.values(rawData1[0]);
      // 1-게임유형 2-티어 3-랭크 6-포인트
    })

    fetch(MatchUrl)
    .then((response2) => {
      return response2.json();
    })
    .then((rawData2)=>{
      let data2 = Object.values(rawData2);
      console.log(data2[0]);

      fetch("https://asia.api.riotgames.com/lol/match/v5/matches/"+data2[0]+"?api_key="+apiKey)
      .then((response2) => {
        return response2.json();
      })
      .then((rawData2)=>{
        let data2 = Object.values(rawData2);
        console.log(data2[1]);
        let sample = data2[1].participants[0].lane;
        console.log(sample);

      })
    })
  })