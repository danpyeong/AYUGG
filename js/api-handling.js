const apiKey = "RGAPI-6e1b716a-027f-4306-930b-458ee9fb0229";
// const testnick = "2U35";
const testnick = "hideonbush";
const encodedName = encodeURI(testnick);
const SereachByNickStartUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
let UserUrl = SereachByNickStartUrl + encodedName + "?api_key=" + apiKey;
const TierUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/";
const version = "https://ddragon.leagueoflegends.com/cdn/13.11.1/";
const championUrl = version + "data/ko_KR/champion.json";
const iconUrl = version + "data/ko_KR/profileicon.json";
let dataSet = new Map();
let match = new Array();

function loadingData() {
  rawResult = fetch(UserUrl)
  .then((response) => {
    return response.json();
  })
  .then((rawData)=>{
    let data = Object.values(rawData);
    // console.log(data);
    // 0-id 2-puuid 3-nickname 4-icon

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
      for(let i=0;i<10;i++){
        match[i] = new Map();
        match[i].set('matchId', data2[i]);
        var ex = fetch("https://asia.api.riotgames.com/lol/match/v5/matches/"+data2[i]+"?api_key="+apiKey)
        .then((response2) => {
          return response2.json();
        })
        .then((rawData2)=>{
          // console.log(data3);
          let data3 = Object.values(rawData2);
          // console.log(data3[0].matchId);
          match[i].set('matchData', data3[1]);
          // console.log(match);
          return match;
        })
      }
      // console.log(match);
      return ex;
    })
    dataSet.set('nickname', data[3]);
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
        dataSet.set('queueType', appData.queueType);//이거아님
      });
    };
    const getData2 = () => {
      example2.then((data) => {
        // console.log(data);
        let matchUser = new Array();
        for(let j=0;j<1;j++){
          let appData = data[j].get('matchData');
          // console.log(appData);
          // dataSet.set('gameEndTimestamp', appData.gameEndTimestamp);
          // dataSet.set('gameDuration', appData.gameDuration);
          let userTier = new Array();
          matchUser[j] = userTier
          // for(let i=0;i<10;i++){
          //   user[i] = new Map();

          //   user[i].set('championName', appData.participants[i].championName);
          //   user[i].set('primaryStyle', appData.participants[i].perks.styles[0].style);
          //   user[i].set('subStyle', appData.participants[i].perks.styles[1].style);
          //   user[i].set('summoner1Id', appData.participants[i].summoner1Id);
          //   user[i].set('summoner2Id', appData.participants[i].summoner2Id);
          //   user[i].set('assists', appData.participants[i].assists);
          //   user[i].set('deaths', appData.participants[i].deaths);
          //   user[i].set('kills', appData.participants[i].kills);
          //   user[i].set('teamId', appData.participants[i].teamId);
          //   user[i].set('killParticipation', appData.participants[i].challenges.killParticipation);
          //   user[i].set('cs', appData.participants[i].totalMinionsKilled + appData.participants[0].neutralMinionsKilled);
          //   user[i].set('item0', appData.participants[i].item0);
          //   user[i].set('item1', appData.participants[i].item1);
          //   user[i].set('item2', appData.participants[i].item2);
          //   user[i].set('item3', appData.participants[i].item3);
          //   user[i].set('item4', appData.participants[i].item4);
          //   user[i].set('item5', appData.participants[i].item5);
          //   user[i].set('item6', appData.participants[i].item6);
          //   user[i].set('summonerName', appData.participants[i].summonerName);
          //   user[i].set('wardsPlaced', appData.participants[i].wardsPlaced);//총와드
          //   user[i].set('visionWardsBoughtInGame', appData.participants[i].visionWardsBoughtInGame);//핑와
          //   user[i].set('totalDamageDealtToChampions', appData.participants[i].totalDamageDealtToChampions);
          //   user[i].set('summonerId', appData.participants[i].summonerId);
          //   user[i].set('champLevel', appData.participants[i].champLevel);

          for(let i=0;i<10;i++){
            let UidguestUrl =  TierUrl + appData.participants[i].summonerId + "?api_key=" + apiKey;
            var example3 = fetch(UidguestUrl).then((response2) => {
              return response2.json();
            })
            .then((rawData2)=>{
              return (rawData2[0].tier+ " " + rawData2[0].rank);
            })
            getData3 = () => {
              example3.then((appData1) => {
                userTier[i] = appData1;
                // console.log(userTier[i]);
              });
            };
            getData3();       
            match[i].set('matchUser', matchUser[i]);
          }
        }
      });
    };
    getData1();
    getData2();
    // console.log(dataSet);   
  })
  // console.log(dataSet);
}
loadingData();

const tierImgMapping = new Map([[
  "NONE" , "/images/tier-icons/provisional.png"],
  ["IRON" , "/images/tier-icons/emblem-iron.png"],
  ["BRONZE" , "/images/tier-icons/emblem-bronze.png"],
  ["SILVER" , "/images/tier-icons/emblem-silver.png"],
  ["GOLD" , "/images/tier-icons/emblem-gold.png"],
  ["PLATINUM" , "/images/tier-icons/emblem-platinum.png"],
  ["DIAMOND" , "/images/tier-icons/emblem-diamond.png"],
  ["MASTER" , "/images/tier-icons/emblem-master.png"],
  ["GRANDMASTER" , "/images/tier-icons/emblem-grandmaster.png"],
  ["CHALLENGER" , "/images/tier-icons/emblem-challenger.png"]])
  
const queueTypeMapping = new Map([[
  "/RANKED_SOLO_5x5", "솔로랭크"],
  ["/RANKED_FLEX_SR", "??"],
  ["/RANKED_FLEX_TT", "??"]]);
  
const spellUrl = version +"data/ko_KR/summoner.json";
const runeUrl = version +"data/ko_KR/runesReforged.json";
const itemUrl = version +"data/ko_KR/item.json";
  
setTimeout(function(){
  sessionStorage.setItem('wins', dataSet.get('wins'));
  sessionStorage.setItem('losses', dataSet.get('losses'));

  var statitext1 = document.getElementById("statiRate");
  statitext1.innerHTML = Math.floor(dataSet.get('wins') / (dataSet.get('wins')+dataSet.get('losses')) *100) +"%";
  var statitext2 = document.getElementById("statiWL");
  statitext2.innerHTML = dataSet.get('wins')+"승 "+dataSet.get('losses')+"패";
  // var statitext3 = document.getElementById("statiKDA");
  // statitext3.innerHTML = dataSet.get('nickname');
  // var statitext4 = document.getElementById("statiKda");
  // statitext4.innerHTML = dataSet.get('nickname');
  // var statitext5 = document.getElementById("statiKillRate");
  // statitext5.innerHTML = dataSet.get('nickname');

  console.log(dataSet);
  console.log(match);
  
  var text1 = document.getElementById("nickname");
  text1.innerHTML = dataSet.get('nickname');
  document.getElementById("player-icon").src = version + "img/profileicon/" + dataSet.get('icon') + ".png";
  var text2 = document.getElementById("tier-name");
  var text3 = document.getElementById("point");
  var text4 = document.getElementById("winRate");
  // var text5 = document.getElementById("??");
  var text6 = document.getElementById("matchDate");
  var text7 = document.getElementById("matchTime");
  var whole = parseInt(dataSet.get('wins'))+parseInt(dataSet.get('losses'));
  var matchStyle = document.getElementById("matchStyle");

  if (dataSet.has('tier')){
    exTier = dataSet.get('tier');
    document.getElementById("tier-icon").src = tierImgMapping.get(exTier);
    document.getElementById("tier-icon").style = 'transform: scale(4);';
    text2.innerHTML = dataSet.get('tier')+" "+dataSet.get('rank');
    text3.innerHTML = dataSet.get('leaguePoints')+"LP";
  } else {
    document.getElementById("tier-icon").src = '/images/tier-icons/provisional.png';
    document.getElementById("tier-icon").style = 'transform: scale(1.5);';
    text2.innerHTML = "UNRANKED";
    text3.innerHTML = "UNRANKED";
  }

  if(dataSet.has('wins')&&dataSet.has('losses')){
    text4.innerHTML = "승률 "+ Math.floor(dataSet.get('wins') / whole *100) +"% ("+dataSet.get('wins')+"승"+dataSet.get('losses')+"패)";
  }else{
    text4.innerHTML = "승률을 위한 데이터수 부족"
  }
  eta = new Date();
  // console.log(eta.getTime()); 
  // console.log(Math.floor((eta.getTime() - match[0].get('matchData').gameEndTimestamp)/3600000)); 
  // console.log(match[0].get('matchData').gameEndTimestamp); 
  // console.log(Math.floor(match[0].get('matchData').gameDuration/60));  
  // console.log(match[0].get('matchData').gameDuration%60); 
  for(let k=0; k<1; k++){//match 1개
    text6.innerHTML = Math.floor((eta.getTime() - match[k].get('matchData').gameEndTimestamp)/3600000) + "시간전";
    text7.innerText = Math.floor(match[k].get('matchData').gameDuration/60) + ":" + match[k].get('matchData').gameDuration%60;
    for(let finduser=0; finduser<10; finduser++){
      if(dataSet.get('id') == match[k].get('matchData').participants[finduser].summonerId){
        let owner = match[k].get('matchData').participants[finduser];
        if(owner.win){
          matchStyle.style.backgroundColor = 'rgba(0, 0, 255, 0.3)';   
        } else{
          matchStyle.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        }
        document.getElementById("champ-icon").src = version + "img/champion/" + owner.championName + ".png";

        fetch(spellUrl)
        .then(response => response.json())
        .then(data => {
          var spellData = data.data;
          // console.log(spellData);
          function findSpellKey(value) {
            for (let a in spellData) {
              if (spellData[a].key == value) {
                // console.log(spellData[a].image.full);
                return spellData[a].image.full;
              }
            }
            return null;
          }
          document.getElementById("spell1").src = version + "img/spell/" + findSpellKey(owner.summoner1Id);
          document.getElementById("spell2").src = version + "img/spell/" + findSpellKey(owner.summoner2Id);
        
        })

        fetch(runeUrl)
        .then(response => response.json())
        .then(data => {
          var runeData = data;
          // console.log(runeData);
          function findRuneKey(value) {
            for (let a = 0; a < runeData.length; a++) {
              if (runeData[a].id == value) {
                // console.log(runeData[a].icon);
                return runeData[a].icon;
              }
            }
            return null;
          }
          function findMainRuneKey(value1,value2) {
            for (let a = 0; a < runeData.length; a++) {
              if (runeData[a].id == value1) {
                // console.log(runeData[a].slots[0].runes.length);
                for (let b = 0; b < runeData[a].slots[0].runes.length; b++) {
                  if (runeData[a].slots[0].runes[b].id == value2) {
                    // console.log(runeData[a].slots[0].runes[b].icon);
                    return runeData[a].slots[0].runes[b].icon;
                  }
                }
                return null;
              }
            }
            return null;
          }
          document.getElementById("summoner1Id").src = "https://ddragon.leagueoflegends.com/cdn/img/" + findMainRuneKey(owner.perks.styles[0].style,owner.perks.styles[0].selections[0].perk);
          document.getElementById("summoner2Id").src = "https://ddragon.leagueoflegends.com/cdn/img/" + findRuneKey(owner.perks.styles[1].style);
        })
        // console.log(owner);
        var text8 = document.getElementById("KDA");
        text8.innerText = owner.kills +"/"+ owner.deaths +"/"+ owner.assists;
        var text9 = document.getElementById("avgKDA");
        text9.innerText = ((owner.kills + owner.assists) / owner.deaths).toFixed(1);
        var text10 = document.getElementById("killRate");
        if (owner.teamId == 100){
          text10.innerText ="킬관여 "+ Math.floor((owner.kills + owner.assists)/match[k].get('matchData').teams[0].objectives.champion.kills*100)+"%";
        } else{
          text10.innerText ="킬관여 "+ Math.floor((owner.kills + owner.assists)/match[k].get('matchData').teams[1].objectives.champion.kills*100)+"%";
        }
        var text11 = document.getElementById("CS");
        text11.innerText = "CS "+ (owner.totalMinionsKilled + owner.neutralMinionsKilled);
        if(owner.item0 != 0){
          document.getElementById("item1").src = version +"img/item/"+ owner.item0 +".png";
        }
        if(owner.item1 != 0){
          document.getElementById("item2").src = version +"img/item/"+ owner.item1 +".png";
        }
        if(owner.item2 != 0){
          document.getElementById("item3").src = version +"img/item/"+ owner.item2 +".png";
        }
        if(owner.item3 != 0){
          document.getElementById("item4").src = version +"img/item/"+ owner.item3 +".png";
        }
        if(owner.item4 != 0){
          document.getElementById("item5").src = version +"img/item/"+ owner.item4 +".png";
        }
        if(owner.item5 != 0){
          document.getElementById("item6").src = version +"img/item/"+ owner.item5 +".png";
        }
        if(owner.item6 != 0){
          document.getElementById("item7").src = version +"img/item/"+ owner.item6 +".png";
        }
      }
    }
    // var twice=0;
    // var partiList = document.getElementById("partiList");
    // while(twice<2){
    //   const childUl = document.createElement("ul");
    //   const childLi = document.createElement("li");
    //   const childSpan1 = document.createElement("span");
    //   const childSpan2 = document.createElement("span");
    //   const childImg = document.createElement("img");

    //   for(let parti=0; parti<10; parti++){
    //     childImg.src = version + "img/champion/" + match[k].get('matchData').participants[parti].championName + ".png";
    //     childSpan2.textContent = match[k].get('matchData').participants[parti].summonerName;
        
    //     childSpan1.appendChild(childImg);
    //     childSpan1.appendChild(childSpan2);
    //     childLi.appendChild(childSpan1);

    //     // console.log(match[k].get('matchData').participants[parti].championName);
    //     // console.log(match[k].get('matchData').participants[parti].summonerName);
    //   }
      
    //   childUl.appendChild(childLi);
    // }
    // partiList.appendChild(childUl);

    for(let parti=0; parti<10; parti++){
      document.getElementById("ex1").src = version + "img/champion/" + match[k].get('matchData').participants[parti].championName + ".png";
      var text12 = document.getElementById("ex2");
      text12.textContent = match[k].get('matchData').participants[parti].summonerName;
          
      //     childSpan1.appendChild(childImg);
      //     childSpan1.appendChild(childSpan2);
      //     childLi.appendChild(childSpan1);
  
      //     // console.log(match[k].get('matchData').participants[parti].championName);
      //     // console.log(match[k].get('matchData').participants[parti].summonerName);
    }

  }

}, 800);
