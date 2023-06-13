const apiKey = "RGAPI-6e1b716a-027f-4306-930b-458ee9fb0229";
const testnick = "hideonbush";
// const testnick = sessionStorage.getItem('nickname');
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
    .then((rawData2)=>{
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
          let userTier = new Array();
          matchUser[j] = userTier

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
  statitext1.innerHTML = Math.floor(dataSet.get('wins') / (dataSet.get('wins') + dataSet.get('losses')) *100) +"%";
  var statitext2 = document.getElementById("statiWL");
  statitext2.innerHTML = dataSet.get('wins')+"승 "+dataSet.get('losses')+"패";

  var statiMost = statiMostChamp();
  var statiMostWhole = statiMostWholeChamp();
  console.log(statiMost);
  
  var SMWtext1 = document.getElementById("SMWKDARate");
  SMWtext1.innerText = "KDA " + ((statiMostWhole.get('kills') + statiMostWhole.get('assists')) / statiMostWhole.get('deaths')).toFixed(2);
  var SMWtext2 = document.getElementById("SMWKDA");
  SMWtext2.innerText = (statiMostWhole.get('kills') / statiMostWhole.get('games')).toFixed(1) +"/"+(statiMostWhole.get('deaths') / statiMostWhole.get('games')).toFixed(1) +"/"+(statiMostWhole.get('assists') / statiMostWhole.get('games')).toFixed(1);
  var SMWtext3 = document.getElementById("SMWCS");
  SMWtext3.innerText = "CS " + Math.floor(statiMostWhole.get('CS') / statiMostWhole.get('games'));
  var SMWtext4 = document.getElementById("SMWRate");
  SMWtext4.innerText = Math.floor(statiMostWhole.get('win') / statiMostWhole.get('games') *100) +"%";
  var SMWtext5 = document.getElementById("SMWGames");
  SMWtext5.innerText = statiMostWhole.get('games') +"전";
  
  var SMtext0 = document.getElementById("SMChamp");
  SMtext0.innerText = statiMost[0].get('champname');
  document.getElementById("SMChampIcon").src = version + "img/champion/" + statiMost[0].get('champname') + ".png";
  var SMtext1 = document.getElementById("SMKDARate");
  SMtext1.innerText = "KDA " + ((statiMost[0].get('kills') + statiMost[0].get('assists')) / statiMost[0].get('deaths')).toFixed(2);
  var SMtext2 = document.getElementById("SMKDA");
  SMtext2.innerText = (statiMost[0].get('kills') / statiMost[0].get('games')).toFixed(1) +"/"+(statiMost[0].get('deaths') / statiMost[0].get('games')).toFixed(1) +"/"+(statiMost[0].get('assists') / statiMost[0].get('games')).toFixed(1);
  var SMtext3 = document.getElementById("SMCS");
  SMtext3.innerText = "CS " + Math.floor(statiMost[0].get('CS') / statiMost[0].get('games'));
  var SMtext4 = document.getElementById("SMRate");
  SMtext4.innerText = Math.floor(statiMost[0].get('win') / statiMost[0].get('games') *100) +"%";
  var SMtext5 = document.getElementById("SMGames");
  SMtext5.innerText = statiMost[0].get('games') +"전";
  
  var SMtext01 = document.getElementById("SMChamp1");
  SMtext01.innerText = statiMost[1].get('champname');
  document.getElementById("SMChampIcon1").src = version + "img/champion/" + statiMost[1].get('champname') + ".png";
  var SMtext11 = document.getElementById("SMKDARate1");
  SMtext11.innerText = "KDA " + ((statiMost[1].get('kills') + statiMost[1].get('assists')) / statiMost[1].get('deaths')).toFixed(2);
  var SMtext21 = document.getElementById("SMKDA1");
  SMtext21.innerText = (statiMost[1].get('kills') / statiMost[1].get('games')).toFixed(1) +"/"+(statiMost[1].get('deaths') / statiMost[1].get('games')).toFixed(1) +"/"+(statiMost[1].get('assists') / statiMost[1].get('games')).toFixed(1);
  var SMtext31 = document.getElementById("SMCS1");
  SMtext31.innerText = "CS " + Math.floor(statiMost[1].get('CS') / statiMost[1].get('games'));
  var SMtext41 = document.getElementById("SMRate1");
  SMtext41.innerText = Math.floor(statiMost[1].get('win') / statiMost[1].get('games') *100) +"%";
  var SMtext51 = document.getElementById("SMGames1");
  SMtext51.innerText = statiMost[1].get('games') +"전";
  
  var SMtext02 = document.getElementById("SMChamp2");
  SMtext02.innerText = statiMost[2].get('champname');
  document.getElementById("SMChampIcon2").src = version + "img/champion/" + statiMost[2].get('champname') + ".png";
  var SMtext12 = document.getElementById("SMKDARate2");
  SMtext12.innerText = "KDA " + ((statiMost[2].get('kills') + statiMost[2].get('assists')) / statiMost[2].get('deaths')).toFixed(2);
  var SMtext22 = document.getElementById("SMKDA2");
  SMtext22.innerText = (statiMost[2].get('kills') / statiMost[2].get('games')).toFixed(1) +"/"+(statiMost[2].get('deaths') / statiMost[2].get('games')).toFixed(1) +"/"+(statiMost[2].get('assists') / statiMost[2].get('games')).toFixed(1);
  var SMtext32 = document.getElementById("SMCS2");
  SMtext32.innerText = "CS " + Math.floor(statiMost[2].get('CS') / statiMost[2].get('games'));
  var SMtext42 = document.getElementById("SMRate2");
  SMtext42.innerText = Math.floor(statiMost[2].get('win') / statiMost[2].get('games') *100) +"%";
  var SMtext52 = document.getElementById("SMGames2");
  SMtext52.innerText = statiMost[2].get('games') +"전";


  var ad = statiMost[0].get('champname');
  fetch(version + "data/ko_KR/champion/"+ad+".json")
  .then((response) => response.json())
  .then((data) => {
    var champData = data.data;
    var we = Object.values(champData);
    SMtext0.innerText = we[0].name;
  })
  

  console.log(dataSet);
  console.log(match);
  
  var text1 = document.getElementById("nickname");
  text1.innerHTML = dataSet.get('nickname');
  document.getElementById("player-icon").src = version + "img/profileicon/" + dataSet.get('icon') + ".png";
  var text2 = document.getElementById("tier-name");
  var text3 = document.getElementById("point");
  var text4 = document.getElementById("winRate");

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
    text4.innerHTML = "승률 "+ Math.floor(dataSet.get('wins') / (dataSet.get('wins') + dataSet.get('losses')) *100) +"% ("+dataSet.get('wins')+"승"+dataSet.get('losses')+"패)";
  }else{
    text4.innerHTML = "승률을 위한 데이터수 부족"
  }
  eta = new Date();
  for(let k=0; k<1; k++){//match 1개
    var text5 = document.getElementById("queueType"); 
    var text6 = document.getElementById("matchDate");
    var text7 = document.getElementById("matchTime");
    var matchStyle = document.getElementById("matchStyle");
    if(match[k].get('matchData').queueId == 420){
      text5.innerText = "솔로 랭크";
    } else if(match[k].get('matchData').queueId == 430){
      text5.innerText = "일반 게임";
    } else if(match[k].get('matchData').queueId == 440){
      text5.innerText = "자유 랭크";
    } else{
      text5.innerText = "기타 게임";
    }
    text6.innerHTML = Math.floor((eta.getTime() - match[k].get('matchData').gameEndTimestamp)/3600000) + "시간전";
    text7.innerText = Math.floor(match[k].get('matchData').gameDuration/60) + ":" + (match[k].get('matchData').gameDuration%60).toString().padStart(2, '0');
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
        } else {
          document.getElementById("item1").src = "/images/item-none.jpg";
          document.getElementById("item1").style.opacity = '0.3';
        }
        if(owner.item1 != 0){
          document.getElementById("item2").src = version +"img/item/"+ owner.item1 +".png";
        } else {
          document.getElementById("item2").src = "/images/item-none.jpg";
          document.getElementById("item2").style.opacity = '0.3';
        }
        if(owner.item2 != 0){
          document.getElementById("item3").src = version +"img/item/"+ owner.item2 +".png";
        } else {
          document.getElementById("item3").src = "/images/item-none.jpg";
          document.getElementById("item3").style.opacity = '0.3';
        }
        if(owner.item3 != 0){
          document.getElementById("item4").src = version +"img/item/"+ owner.item3 +".png";
        } else {
          document.getElementById("item4").src = "/images/item-none.jpg";
          document.getElementById("item4").style.opacity = '0.3';
        }
        if(owner.item4 != 0){
          document.getElementById("item5").src = version +"img/item/"+ owner.item4 +".png";
        } else {
          document.getElementById("item5").src = "/images/item-none.jpg";
          document.getElementById("item5").style.opacity = '0.3';
        }
        if(owner.item5 != 0){
          document.getElementById("item6").src = version +"img/item/"+ owner.item5 +".png";
        } else {
          document.getElementById("item6").src = "/images/item-none.jpg";
          document.getElementById("item6").style.opacity = '0.3';
        }
        if(owner.item6 != 0){
          document.getElementById("item7").src = version +"img/item/"+ owner.item6 +".png";
        } else {
          document.getElementById("item7").src = "/images/item-none.jpg";
          document.getElementById("item7").style.opacity = '0.3';
        }
      }
    }
    partiListMaking1("partiList1",k);
    partiListMaking2("partiList2",k);
    
    var text12 = document.getElementById("teamBlueWL");
    var text13 = document.getElementById("teamRedWL");
    var pathTB = document.getElementById("towerBluePath");
    var pathTR = document.getElementById("towerRedPath");
    var pathDB = document.getElementById("dragonBluePath");
    var pathDR = document.getElementById("dragonRedPath");
    var pathBB = document.getElementById("baronBluePath");
    var pathBR = document.getElementById("baronRedPath");
    if(match[k].get('matchData').teams[0].win){
      text12.innerText = "승리";
      text12.style.color = "rgba(0, 0, 255, 0.5)";
      pathTB.style.fill = "rgba(0, 0, 255, 0.5)";
      pathDB.style.fill = "rgba(0, 0, 255, 0.5)";
      pathBB.style.fill = "rgba(0, 0, 255, 0.5)";
      text13.innerText = "패배";
      text13.style.color = "rgba(255, 0, 0, 0.5)";
      pathTR.style.fill = "rgba(255, 0, 0, 0.5)";
      pathDR.style.fill = "rgba(255, 0, 0, 0.5)";
      pathBR.style.fill = "rgba(255, 0, 0, 0.5)";
    } else{
      text12.innerText = "패배";
      text12.style.color = "rgba(255, 0, 0, 0.5)";
      pathTB.style.fill = "rgba(255, 0, 0, 0.5)";
      pathDB.style.fill = "rgba(255, 0, 0, 0.5)";
      pathBB.style.fill = "rgba(255, 0, 0, 0.5)";
      text13.innerText = "승리";
      text13.style.color = "rgba(0, 0, 255, 0.5)";
      pathTR.style.fill = "rgba(0, 0, 255, 0.5)";
      pathDR.style.fill = "rgba(0, 0, 255, 0.5)";
      pathBR.style.fill = "rgba(0, 0, 255, 0.5)";
    }    
    // console.log(match[k].get('matchData').teams[0]);
    var text14 = document.getElementById("towerBlue");
    var text15 = document.getElementById("dragonBlue");
    var text16 = document.getElementById("baronBlue");
    var text17 = document.getElementById("towerRed");
    var text18 = document.getElementById("dragonRed");
    var text19 = document.getElementById("baronRed");
    var text20 = document.getElementById("goldBlue");
    var text21 = document.getElementById("goldRed");
    var text22 = document.getElementById("killsBlue");
    var text23 = document.getElementById("killsRed");

    let goldBlue = 0;
    let goldRed = 0;
    for(let p=0;p<5;p++){
      goldBlue += match[k].get('matchData').participants[p].goldEarned;
      goldRed += match[k].get('matchData').participants[p+5].goldEarned;
    }
    text14.innerText = match[k].get('matchData').teams[0].objectives.tower.kills;
    text15.innerText = match[k].get('matchData').teams[0].objectives.dragon.kills;
    text16.innerText = match[k].get('matchData').teams[0].objectives.baron.kills;
    text17.innerText = match[k].get('matchData').teams[1].objectives.tower.kills;
    text18.innerText = match[k].get('matchData').teams[1].objectives.dragon.kills;
    text19.innerText = match[k].get('matchData').teams[1].objectives.baron.kills;
    text20.innerText = Math.floor(goldBlue/100)/10  + "K";
    text21.innerText = Math.floor(goldRed/100)/10 + "K";
    text22.innerText = match[k].get('matchData').teams[0].objectives.champion.kills;
    text23.innerText = match[k].get('matchData').teams[1].objectives.champion.kills;

    // var text8 = document.getElementById("KDA");
    // text8.innerText = owner.kills +"/"+ owner.deaths +"/"+ owner.assists;

    matchDtFirstBlue("dtPartiBlue",k);
    matchDtFirstRed("dtPartiRed",k);
    
    }
}, 1800);


function partiListMaking1(id,k){
  var ulId = document.getElementById(id);
  for(let i=0;i<5;i++){
    var childLi = document.createElement("li");
    var childSpan = document.createElement("span");
    var childSpan2 = document.createElement("span");
    var childImg = document.createElement("img");

    childImg.src = version + "img/champion/" + match[k].get('matchData').participants[i].championName + ".png";
    childSpan2.textContent = match[k].get('matchData').participants[i].summonerName;
    
    childSpan.appendChild(childImg);
    childSpan.appendChild(childSpan2);
    childLi.appendChild(childSpan);
    ulId.appendChild(childLi);
  }
}
function partiListMaking2(id,k){
  var ulId = document.getElementById(id);
  for(let i=5;i<10;i++){
    var childLi = document.createElement("li");
    var childSpan = document.createElement("span");
    var childSpan2 = document.createElement("span");
    var childImg = document.createElement("img");

    childImg.src = version + "img/champion/" + match[k].get('matchData').participants[i].championName + ".png";
    childSpan2.textContent = match[k].get('matchData').participants[i].summonerName;
    
    childSpan.appendChild(childImg);
    childSpan.appendChild(childSpan2);
    childLi.appendChild(childSpan);
    ulId.appendChild(childLi);
  }
  // console.log(ulId);
}

function matchDtFirstBlue(id,k){
  var Id = document.getElementById(id);
  for(let i=0;i<5;i++){
    var childDiv0 = document.createElement("div");
    var childDiv1 = document.createElement("div");
    var childDiv2 = document.createElement("div");
    var childDiv3 = document.createElement("div");
    var childDiv4 = document.createElement("div");
    var childDiv5 = document.createElement("div");
    const childDiv6 = document.createElement("div");
    var childDiv7 = document.createElement("div");
    var childDiv8 = document.createElement("div");
    var childDiv9 = document.createElement("div");
    var childDiv10 = document.createElement("div");
    var childDiv11 = document.createElement("div");
    var childDiv12 = document.createElement("div");
    var childDiv13 = document.createElement("div");
    var childDiv14 = document.createElement("div");
    var childDiv15 = document.createElement("div");
    var childDiv16 = document.createElement("div");
    
    var childSpan0 = document.createElement("span");
    var childSpan1 = document.createElement("span");
    
    var childTr = document.createElement("tr");
    var childTd0 = document.createElement("td");
    var childTd1 = document.createElement("td");
    var childTd2 = document.createElement("td");
    var childTd3 = document.createElement("td");
    var childTd4 = document.createElement("td");
    var childTd5 = document.createElement("td");
  
    const childImg0 = document.createElement("img");
    const childImg1 = document.createElement("img");
    const childImg2 = document.createElement("img");
    const childImg3 = document.createElement("img");
    const childImg4 = document.createElement("img");
    const childImg5 = document.createElement("img");
    const childImg6 = document.createElement("img");
    const childImg7 = document.createElement("img");
    const childImg8 = document.createElement("img");
    const childImg9 = document.createElement("img");
    const childImg10 = document.createElement("img");
    const childImg11 = document.createElement("img");
    const childImg12 = document.createElement("img");
  
    childTd0.classList.add('dt-first');
    childDiv0.classList.add('dt-first-first');
    childSpan0.classList.add('c-l');
    childImg0.classList.add('champ-icon');
    childImg0.src =  version + "img/champion/" + match[k].get('matchData').participants[i].championName + ".png";
    childDiv1.textContent = match[k].get('matchData').participants[i].champLevel;
    childDiv1.classList.add('level');
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
      childImg1.src = version + "img/spell/" + findSpellKey(match[k].get('matchData').participants[i].summoner1Id);
      childImg1.classList.add('dt-small-img');
      childImg2.src = version + "img/spell/" + findSpellKey(match[k].get('matchData').participants[i].summoner2Id);
      childImg2.classList.add('dt-small-img');
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
      childImg3.src = "https://ddragon.leagueoflegends.com/cdn/img/" + findMainRuneKey(match[k].get('matchData').participants[i].perks.styles[0].style,match[k].get('matchData').participants[i].perks.styles[0].selections[0].perk);
      childImg3.classList.add('dt-small-img');
      childImg4.src = "https://ddragon.leagueoflegends.com/cdn/img/" + findRuneKey(match[k].get('matchData').participants[i].perks.styles[1].style);
      childImg4.classList.add('dt-small-img');
    })
    
    childDiv4.classList.add('nick-tier');
    childDiv5.textContent = match[k].get('matchData').participants[i].summonerName;
    childDiv6.textContent = match[k].get('matchUser')[i];
    childDiv6.classList.add('font3');
    childDiv7.textContent = match[k].get('matchData').participants[i].totalDamageDealtToChampions;
    childDiv15.classList.add('damage-graph');
    childDiv16.classList.add('bar');
    childDiv16.style.width = match[k].get('matchData').participants[i].totalDamageDealtToChampions/(mostDamage(k))*60+'px';
    childDiv9.textContent = match[k].get('matchData').participants[i].kills +"/"+ match[k].get('matchData').participants[i].deaths +"/"+ match[k].get('matchData').participants[i].assists;
    childDiv10.textContent = "("+((match[k].get('matchData').participants[i].kills + match[k].get('matchData').participants[i].assists) / match[k].get('matchData').participants[i].deaths).toFixed(1)+")";
    childDiv10.classList.add('font3');
    childDiv11.textContent = match[k].get('matchData').participants[i].totalMinionsKilled + match[k].get('matchData').participants[i].neutralMinionsKilled;
    childDiv12.textContent = "("+((match[k].get('matchData').participants[i].totalMinionsKilled + match[k].get('matchData').participants[i].neutralMinionsKilled) / match[k].get('matchData').gameDuration *60).toFixed(1)+")";
    childDiv12.classList.add('font3');
    childDiv13.textContent = match[k].get('matchData').participants[i].wardsPlaced;
    childDiv14.textContent ="("+ (match[k].get('matchData').participants[i].wardsPlaced-match[k].get('matchData').participants[i].visionWardsBoughtInGame) +"/"+match[k].get('matchData').participants[i].visionWardsBoughtInGame+")";
    childDiv14.classList.add('font3');
    childImg6.classList.add('dt-smallItem-img');
    childImg7.classList.add('dt-smallItem-img');
    childImg8.classList.add('dt-smallItem-img');
    childImg9.classList.add('dt-smallItem-img');
    childImg10.classList.add('dt-smallItem-img');
    childImg11.classList.add('dt-smallItem-img');
    childImg12.classList.add('dt-smallItem-img');
    if(match[k].get('matchData').participants[i].item0 == 0){
      childImg6.src = "/images/item-none.jpg";
      childImg6.style.opacity = '0.3';
    }else {
      childImg6.src = version +"img/item/"+ match[k].get('matchData').participants[i].item0 +".png";      
    }
    if(match[k].get('matchData').participants[i].item1 == 0){
      childImg7.src = "/images/item-none.jpg";
      childImg7.style.opacity = '0.3';
    }else {
      childImg7.src = version +"img/item/"+ match[k].get('matchData').participants[i].item1 +".png";
    }
    if(match[k].get('matchData').participants[i].item2 == 0){
      childImg8.src = "/images/item-none.jpg";
      childImg8.style.opacity = '0.3';
    }else {
      childImg8.src = version +"img/item/"+ match[k].get('matchData').participants[i].item2 +".png";      
    }
    if(match[k].get('matchData').participants[i].item3 == 0){
      childImg9.src = "/images/item-none.jpg";
      childImg9.style.opacity = '0.3';
    }else {
      childImg9.src = version +"img/item/"+ match[k].get('matchData').participants[i].item3 +".png";      
    }
    if(match[k].get('matchData').participants[i].item4 == 0){
      childImg10.src = "/images/item-none.jpg";
      childImg10.style.opacity = '0.3';
    }else {
      childImg10.src = version +"img/item/"+ match[k].get('matchData').participants[i].item4 +".png";      
    }
    if(match[k].get('matchData').participants[i].item5 == 0){
      childImg11.src = "/images/item-none.jpg";
      childImg11.style.opacity = '0.3';
    }else {
      childImg11.src = version +"img/item/"+ match[k].get('matchData').participants[i].item5 +".png";      
    }
    if(match[k].get('matchData').participants[i].item6 == 0){
      childImg12.src = "/images/item-none.jpg";
      childImg12.style.opacity = '0.3';
    }else {
      childImg12.src = version +"img/item/"+ match[k].get('matchData').participants[i].item6 +".png";     
    }
    childImg12.style.borderRadius = '50%';
  
    childTr.appendChild(childTd0);
    childTd0.appendChild(childDiv0);
    childDiv0.appendChild(childSpan0);
    childSpan0.appendChild(childImg0);
    childSpan0.appendChild(childDiv1);
    childDiv0.appendChild(childSpan1);
    childSpan1.appendChild(childDiv2);
    childDiv2.appendChild(childImg1);
    childDiv2.appendChild(childImg2);
    childSpan1.appendChild(childDiv3);
    childDiv3.appendChild(childImg3);
    childDiv3.appendChild(childImg4);
    childTd0.appendChild(childDiv4);
    childDiv4.appendChild(childDiv5);
    childDiv4.appendChild(childDiv6);
    childTr.appendChild(childTd1);
    childTd1.appendChild(childDiv7);
    childTd1.appendChild(childDiv8);
    childDiv8.appendChild(childDiv15);
    childDiv15.appendChild(childDiv16);
    childTr.appendChild(childTd2);
    childTd2.appendChild(childDiv9);
    childTd2.appendChild(childDiv10);
    childTr.appendChild(childTd3);
    childTd3.appendChild(childDiv11);
    childTd3.appendChild(childDiv12);
    childTr.appendChild(childTd4);
    childTd4.appendChild(childDiv13);
    childTd4.appendChild(childDiv14);
    childTr.appendChild(childTd5);
    childTd5.appendChild(childImg6);
    childTd5.appendChild(childImg7);
    childTd5.appendChild(childImg8);
    childTd5.appendChild(childImg9);
    childTd5.appendChild(childImg10);
    childTd5.appendChild(childImg11);
    childTd5.appendChild(childImg12);
    Id.appendChild(childTr);
  }
}
function matchDtFirstRed(id,k){
  var Id = document.getElementById(id);
  for(let i=5;i<10;i++){
    var childDiv0 = document.createElement("div");
    var childDiv1 = document.createElement("div");
    var childDiv2 = document.createElement("div");
    var childDiv3 = document.createElement("div");
    var childDiv4 = document.createElement("div");
    var childDiv5 = document.createElement("div");
    var childDiv6 = document.createElement("div");
    var childDiv7 = document.createElement("div");
    var childDiv8 = document.createElement("div");
    var childDiv9 = document.createElement("div");
    var childDiv10 = document.createElement("div");
    var childDiv11 = document.createElement("div");
    var childDiv12 = document.createElement("div");
    var childDiv13 = document.createElement("div");
    var childDiv14 = document.createElement("div");
    var childDiv15 = document.createElement("div");
    var childDiv16 = document.createElement("div");
    
    var childSpan0 = document.createElement("span");
    var childSpan1 = document.createElement("span");
    
    var childTr = document.createElement("tr");
    var childTd0 = document.createElement("td");
    var childTd1 = document.createElement("td");
    var childTd2 = document.createElement("td");
    var childTd3 = document.createElement("td");
    var childTd4 = document.createElement("td");
    var childTd5 = document.createElement("td");
  
    const childImg0 = document.createElement("img");
    const childImg1 = document.createElement("img");
    const childImg2 = document.createElement("img");
    const childImg3 = document.createElement("img");
    const childImg4 = document.createElement("img");
    const childImg5 = document.createElement("img");
    const childImg6 = document.createElement("img");
    const childImg7 = document.createElement("img");
    const childImg8 = document.createElement("img");
    const childImg9 = document.createElement("img");
    const childImg10 = document.createElement("img");
    const childImg11 = document.createElement("img");
    const childImg12 = document.createElement("img");
  
    childTd0.classList.add('dt-first');
    childDiv0.classList.add('dt-first-first');
    childSpan0.classList.add('c-l');
    childImg0.classList.add('champ-icon');
    childImg0.src =  version + "img/champion/" + match[k].get('matchData').participants[i].championName + ".png";
    childDiv1.textContent = match[k].get('matchData').participants[i].champLevel;
    childDiv1.classList.add('level');
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
      childImg1.src = version + "img/spell/" + findSpellKey(match[k].get('matchData').participants[i].summoner1Id);
      childImg1.classList.add('dt-small-img');
      childImg2.src = version + "img/spell/" + findSpellKey(match[k].get('matchData').participants[i].summoner2Id);
      childImg2.classList.add('dt-small-img');
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
      childImg3.src = "https://ddragon.leagueoflegends.com/cdn/img/" + findMainRuneKey(match[k].get('matchData').participants[i].perks.styles[0].style,match[k].get('matchData').participants[i].perks.styles[0].selections[0].perk);
      childImg3.classList.add('dt-small-img');
      childImg4.src = "https://ddragon.leagueoflegends.com/cdn/img/" + findRuneKey(match[k].get('matchData').participants[i].perks.styles[1].style);
      childImg4.classList.add('dt-small-img');
    })
    childDiv4.classList.add('nick-tier');
    childDiv5.textContent = match[k].get('matchData').participants[i].summonerName;
    childDiv6.textContent = match[k].get('matchUser')[i];
    childDiv6.classList.add('font3');
    childDiv7.textContent = match[k].get('matchData').participants[i].totalDamageDealtToChampions;
    childDiv15.classList.add('damage-graph');
    childDiv16.classList.add('bar');
    childDiv16.style.width = match[k].get('matchData').participants[i].totalDamageDealtToChampions/(mostDamage(k))*60+'px';
    childDiv9.textContent = match[k].get('matchData').participants[i].kills +"/"+ match[k].get('matchData').participants[i].deaths +"/"+ match[k].get('matchData').participants[i].assists;
    childDiv10.textContent = "("+((match[k].get('matchData').participants[i].kills + match[k].get('matchData').participants[i].assists) / match[k].get('matchData').participants[i].deaths).toFixed(1)+")";
    childDiv10.classList.add('font3');
    childDiv11.textContent = match[k].get('matchData').participants[i].totalMinionsKilled + match[k].get('matchData').participants[i].neutralMinionsKilled;
    childDiv12.textContent = "("+((match[k].get('matchData').participants[i].totalMinionsKilled + match[k].get('matchData').participants[i].neutralMinionsKilled) / match[k].get('matchData').gameDuration *60).toFixed(1)+")";
    childDiv12.classList.add('font3');
    childDiv13.textContent = match[k].get('matchData').participants[i].wardsPlaced;
    childDiv14.textContent ="("+ (match[k].get('matchData').participants[i].wardsPlaced-match[k].get('matchData').participants[i].visionWardsBoughtInGame) +"/"+match[k].get('matchData').participants[i].visionWardsBoughtInGame+")";
    childDiv14.classList.add('font3');
    childImg6.classList.add('dt-smallItem-img');
    childImg7.classList.add('dt-smallItem-img');
    childImg8.classList.add('dt-smallItem-img');
    childImg9.classList.add('dt-smallItem-img');
    childImg10.classList.add('dt-smallItem-img');
    childImg11.classList.add('dt-smallItem-img');
    childImg12.classList.add('dt-smallItem-img');
    if(match[k].get('matchData').participants[i].item0 == 0){
      childImg6.src = "/images/item-none.jpg";
      childImg6.style.opacity = '0.3';
    }else {
      childImg6.src = version +"img/item/"+ match[k].get('matchData').participants[i].item0 +".png";      
    }
    if(match[k].get('matchData').participants[i].item1 == 0){
      childImg7.src = "/images/item-none.jpg";
      childImg7.style.opacity = '0.3';
    }else {
      childImg7.src = version +"img/item/"+ match[k].get('matchData').participants[i].item1 +".png";
    }
    if(match[k].get('matchData').participants[i].item2 == 0){
      childImg8.src = "/images/item-none.jpg";
      childImg8.style.opacity = '0.3';
    }else {
      childImg8.src = version +"img/item/"+ match[k].get('matchData').participants[i].item2 +".png";      
    }
    if(match[k].get('matchData').participants[i].item3 == 0){
      childImg9.src = "/images/item-none.jpg";
      childImg9.style.opacity = '0.3';
    }else {
      childImg9.src = version +"img/item/"+ match[k].get('matchData').participants[i].item3 +".png";      
    }
    if(match[k].get('matchData').participants[i].item4 == 0){
      childImg10.src = "/images/item-none.jpg";
      childImg10.style.opacity = '0.3';
    }else {
      childImg10.src = version +"img/item/"+ match[k].get('matchData').participants[i].item4 +".png";      
    }
    if(match[k].get('matchData').participants[i].item5 == 0){
      childImg11.src = "/images/item-none.jpg";
      childImg11.style.opacity = '0.3';
    }else {
      childImg11.src = version +"img/item/"+ match[k].get('matchData').participants[i].item5 +".png";      
    }
    if(match[k].get('matchData').participants[i].item6 == 0){
      childImg12.src = "/images/item-none.jpg";
      childImg12.style.opacity = '0.3';
    }else {
      childImg12.src = version +"img/item/"+ match[k].get('matchData').participants[i].item6 +".png";     
    }
    childImg12.style.borderRadius = '50%';
  
    childTr.appendChild(childTd0);
    childTd0.appendChild(childDiv0);
    childDiv0.appendChild(childSpan0);
    childSpan0.appendChild(childImg0);
    childSpan0.appendChild(childDiv1);
    childDiv0.appendChild(childSpan1);
    childSpan1.appendChild(childDiv2);
    childDiv2.appendChild(childImg1);
    childDiv2.appendChild(childImg2);
    childSpan1.appendChild(childDiv3);
    childDiv3.appendChild(childImg3);
    childDiv3.appendChild(childImg4);
    childTd0.appendChild(childDiv4);
    childDiv4.appendChild(childDiv5);
    childDiv4.appendChild(childDiv6);
    childTr.appendChild(childTd1);
    childTd1.appendChild(childDiv7);
    childTd1.appendChild(childDiv8);
    childDiv8.appendChild(childDiv15);
    childDiv15.appendChild(childDiv16);
    childTr.appendChild(childTd2);
    childTd2.appendChild(childDiv9);
    childTd2.appendChild(childDiv10);
    childTr.appendChild(childTd3);
    childTd3.appendChild(childDiv11);
    childTd3.appendChild(childDiv12);
    childTr.appendChild(childTd4);
    childTd4.appendChild(childDiv13);
    childTd4.appendChild(childDiv14);
    childTr.appendChild(childTd5);
    childTd5.appendChild(childImg6);
    childTd5.appendChild(childImg7);
    childTd5.appendChild(childImg8);
    childTd5.appendChild(childImg9);
    childTd5.appendChild(childImg10);
    childTd5.appendChild(childImg11);
    childTd5.appendChild(childImg12);
    Id.appendChild(childTr);
  }
}

function mostDamage(k){
  let mostDamage = match[k].get('matchData').participants[0].totalDamageDealtToChampions;
  for(let i=1;i<10;i++){
    if(mostDamage < match[k].get('matchData').participants[i].totalDamageDealtToChampions){
      mostDamage = match[k].get('matchData').participants[i].totalDamageDealtToChampions;
    }
  }
  return mostDamage;
}

function statiMostChamp(){
  //champ kda killrate cs win
  let statiexMostChamp = new Array();
  const Num = 4;
  for(let i=0; i<Num; i++){
    for(let finduser=0; finduser<10; finduser++){
      if(dataSet.get('id') == match[i].get('matchData').participants[finduser].summonerId){
        let owner = match[i].get('matchData').participants[finduser];
        let statiexSet = new Map();
        statiexSet.set('champname', owner.championName);
        statiexSet.set('kills', owner.kills);
        statiexSet.set('deaths', owner.deaths);
        statiexSet.set('assists', owner.assists);
        statiexSet.set('CS', (owner.totalMinionsKilled + owner.neutralMinionsKilled));
        if(owner.win == true){
          statiexSet.set('win', 1);
        } else {
          statiexSet.set('win', 0);
        }
        statiexSet.set('games', 1);
        statiexMostChamp[i] = statiexSet;
      }
    }
  }
  for(let b = 0; b<Num-1; b++){
    for(let a=b; a<Num-1; a++){
      if(statiexMostChamp[a].get('champname') == statiexMostChamp[a+1].get('champname')){
        statiexMostChamp[a+1].set('kills', statiexMostChamp[a].get('kills')+statiexMostChamp[a+1].get('kills'));
        statiexMostChamp[a+1].set('deaths', statiexMostChamp[a].get('deaths')+statiexMostChamp[a+1].get('deaths'));
        statiexMostChamp[a+1].set('assists', statiexMostChamp[a].get('assists')+statiexMostChamp[a+1].get('assists'));
        statiexMostChamp[a+1].set('CS', statiexMostChamp[a].get('CS')+statiexMostChamp[a+1].get('CS'));
        statiexMostChamp[a+1].set('win', statiexMostChamp[a].get('win')+statiexMostChamp[a+1].get('win'));
        statiexMostChamp[a+1].set('games', statiexMostChamp[a].get('games')+statiexMostChamp[a+1].get('games'));
        statiexMostChamp[a] = null;
      }
    }
  }
  // console.log(statiexMostChamp);
  var filteredArray = statiexMostChamp.filter((value) => value != null);
  filteredArray.sort((a, b) => {
    if(a.games == b.games){
      return b.get('win') - a.get('win');
    } else {
      return b.get('games') - a.get('games');
    }
  });
  return filteredArray;
}

function statiMostWholeChamp(){
  //champ kda killrate cs win
  let statiMostWholeChamp = new Array();
  const Num = 4;
  for(let i=0; i<Num; i++){
    for(let finduser=0; finduser<10; finduser++){
      if(dataSet.get('id') == match[i].get('matchData').participants[finduser].summonerId){
        let owner = match[i].get('matchData').participants[finduser];
        let statiexSet = new Map();
        statiexSet.set('champname', owner.championName);
        statiexSet.set('kills', owner.kills);
        statiexSet.set('deaths', owner.deaths);
        statiexSet.set('assists', owner.assists);
        statiexSet.set('CS', (owner.totalMinionsKilled + owner.neutralMinionsKilled));
        if(owner.win == true){
          statiexSet.set('win', 1);
        } else {
          statiexSet.set('win', 0);
        }
        statiexSet.set('games', 1);
        statiMostWholeChamp[i] = statiexSet;
      }
    }
  }
    for(let a=0; a<Num-1; a++){
      statiMostWholeChamp[a+1].set('kills', statiMostWholeChamp[a].get('kills')+statiMostWholeChamp[a+1].get('kills'));
      statiMostWholeChamp[a+1].set('deaths', statiMostWholeChamp[a].get('deaths')+statiMostWholeChamp[a+1].get('deaths'));
      statiMostWholeChamp[a+1].set('assists', statiMostWholeChamp[a].get('assists')+statiMostWholeChamp[a+1].get('assists'));
      statiMostWholeChamp[a+1].set('CS', statiMostWholeChamp[a].get('CS')+statiMostWholeChamp[a+1].get('CS'));
      statiMostWholeChamp[a+1].set('win', statiMostWholeChamp[a].get('win')+statiMostWholeChamp[a+1].get('win'));
      statiMostWholeChamp[a+1].set('games', statiMostWholeChamp[a].get('games')+statiMostWholeChamp[a+1].get('games'));
    }
  return statiMostWholeChamp[Num-1];
}