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
      });
    };
    const getData2 = () => {
      example2.then((data) => {
        // console.log(data);
        let matchUser = new Array();
        for(let j=0;j<2;j++){
          let appData = data[j].get('matchData');
          let userTier = new Array();
          matchUser[j] = userTier

          for(let i=0;i<10;i++){
            if(dataSet.get('id') == appData.participants[i].summonerId){
              userTier[i] = (dataSet.get('tier')+" "+dataSet.get('rank'));
            }else{
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
            }       
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
  ["CHALLENGER" , "/images/tier-icons/emblem-challenger.png"]]
)
  
const spellUrl = version +"data/ko_KR/summoner.json";
const runeUrl = version +"data/ko_KR/runesReforged.json";
const itemUrl = version +"data/ko_KR/item.json";
  
setTimeout(function(){
  console.log(match);

  sessionStorage.setItem('wins', dataSet.get('wins'));
  sessionStorage.setItem('losses', dataSet.get('losses'));
  sessionStorage.setItem('tier', dataSet.get('tier') +" "+dataSet.get('rank'));
  var sessiontext22 = document.getElementById("session22");
  sessiontext22.innerText = dataSet.get('tier') +" "+dataSet.get('rank');
  var statitext1 = document.getElementById("statiRate");
  statitext1.innerHTML = Math.floor(dataSet.get('wins') / (dataSet.get('wins') + dataSet.get('losses')) *100) +"%";
  var statitext2 = document.getElementById("statiWL");
  statitext2.innerHTML = dataSet.get('wins')+"승 "+dataSet.get('losses')+"패";

  var statiMost = statiMostChamp();
  var statiMostWhole = statiMostWholeChamp();

  var statiKDAtext = document.getElementById("statiKDA");
  statiKDAtext.innerText = "KDA " + ((statiMostWhole.get('kills') + statiMostWhole.get('assists')) / statiMostWhole.get('deaths')).toFixed(2);
  var statiKda = document.getElementById("statiKda");
  statiKda.innerText = (statiMostWhole.get('kills') / statiMostWhole.get('games')).toFixed(1) +"/"+(statiMostWhole.get('deaths') / statiMostWhole.get('games')).toFixed(1) +"/"+(statiMostWhole.get('assists') / statiMostWhole.get('games')).toFixed(1);
  var statiKillRate = document.getElementById("statiKillRate");
  statiKillRate.innerText = "킬관여 " + Math.floor((statiMostWhole.get('kills') + statiMostWhole.get('assists'))/ statiMostWhole.get('killsTeam')*100)+"%";
  
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


  var ad0 = statiMost[0].get('champname');
  var ad1 = statiMost[1].get('champname');
  var ad2 = statiMost[2].get('champname');
  fetch(version + "data/ko_KR/champion/"+ad0+".json")
  .then((response) => response.json())
  .then((data) => {
    var champData = data.data;
    var we0 = Object.values(champData);
    SMtext0.innerText = we0[0].name;
  })
  fetch(version + "data/ko_KR/champion/"+ad1+".json")
  .then((response) => response.json())
  .then((data) => {
    var champData = data.data;
    var we1 = Object.values(champData);
    SMtext01.innerText = we1[0].name;
  })
  fetch(version + "data/ko_KR/champion/"+ad2+".json")
  .then((response) => response.json())
  .then((data) => {
    var champData = data.data;
    var we2 = Object.values(champData);
    SMtext02.innerText = we2[0].name;
  })

  var exx =[];
  var index=0;
  var radarGraphData = [
    ((statiMostWhole.get('kills') + statiMostWhole.get('assists')) / statiMostWhole.get('deaths')*10).toFixed(2),
    (statiMostWhole.get('CS') / statiMostWhole.get('games')/3).toFixed(2),
    (statiMostWhole.get('visionScorePerMinute')/3*200).toFixed(2),
    (statiMostWhole.get('goldPerMinute')/16*5).toFixed(2),
    (statiMostWhole.get('damagePerMinute')/15).toFixed(2)
  ];//10 300 1.5 400 1500 ['KDA', 'CS', '시야', '성장', '전투']
  radarGraphData.forEach(element => {
    if(element>80){
      element=80;
    }
    exx[index]=element;
    index++;
  });
  sessionStorage.setItem('radarGraphData', exx);
  
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
  for(let k=0; k<2; k++){//match 1개

    //#region 
    const matchesDiv = document.getElementById('matches');

    const gameDiv = document.createElement("div");
    gameDiv.classList.add("game");

    const matchDiv = document.createElement("div");
    matchDiv.classList.add("match");

    const matchFirstDiv = document.createElement("div");
    matchFirstDiv.classList.add("match-first");

    const queueTypeDiv = document.createElement("div");
    queueTypeDiv.classList.add("font1");
    if(match[k].get('matchData').queueId == 420){
      queueTypeDiv.textContent = "솔로 랭크";
    } else if(match[k].get('matchData').queueId == 430){
      queueTypeDiv.textContent = "일반 게임";
    } else if(match[k].get('matchData').queueId == 440){
      queueTypeDiv.textContent = "자유 랭크";
    } else{
      queueTypeDiv.textContent = "기타 게임";
    }

    const matchDateDiv = document.createElement("div");
    matchDateDiv.classList.add("font2");
    matchDateDiv.textContent = Math.floor((eta.getTime() - match[k].get('matchData').gameEndTimestamp)/3600000) + "시간전";

    const matchTimeDiv = document.createElement("div");
    matchTimeDiv.classList.add("font2");
    matchTimeDiv.textContent = Math.floor(match[k].get('matchData').gameDuration/60) + ":" + (match[k].get('matchData').gameDuration%60).toString().padStart(2, '0');

    const matchSecondDiv = document.createElement("div");
    matchSecondDiv.classList.add("match-second");

    const champIconImg = document.createElement("img");
    champIconImg.style.width = "45px";
    champIconImg.style.height = "45px";
    champIconImg.style.paddingRight = "10px";
    champIconImg.style.alignItems = "center";

    const spell1Img = document.createElement("img");
    spell1Img.style.width = "20px";
    spell1Img.style.height = "20px";
    spell1Img.style.paddingRight = "4px";

    const spell2Img = document.createElement("img");
    spell2Img.style.width = "20px";
    spell2Img.style.height = "20px";

    const spellDiv = document.createElement("div");

    const summoner1IdImg = document.createElement("img");
    summoner1IdImg.style.width = "20px";
    summoner1IdImg.style.height = "20px";
    summoner1IdImg.style.transform = "scale(1.3)";
    summoner1IdImg.style.paddingRight = "4px";

    const summoner2IdImg = document.createElement("img");
    summoner2IdImg.style.width = "20px";
    summoner2IdImg.style.height = "20px";

    const summonerDiv = document.createElement("div");

    const spellAndSummonerSpan = document.createElement("span");

    const matchThirdDiv = document.createElement("div");
    matchThirdDiv.classList.add("match-third");

    const kdaDiv = document.createElement("div");
    kdaDiv.classList.add("font1");

    const avgKDADiv = document.createElement("div");
    avgKDADiv.classList.add("font2");


    const matchFourthDiv = document.createElement("div");
    matchFourthDiv.classList.add("match-fourth");

    const killRateSpan = document.createElement("span");
    killRateSpan.classList.add("font2");

    const CSSpan = document.createElement("span");
    CSSpan.classList.add("font2");
    CSSpan.style.paddingLeft = "3px";

    const killRateAndCSDiv = document.createElement("div");
    killRateAndCSDiv.style.paddingBottom = "5px";

    const item1Img = document.createElement("img");
    item1Img.style.width = "20px";
    item1Img.style.height = "20px";
    item1Img.style.paddingRight = "4px";

    const item2Img = document.createElement("img");
    item2Img.style.width = "20px";
    item2Img.style.height = "20px";
    item2Img.style.paddingRight = "4px";

    const item3Img = document.createElement("img");
    item3Img.style.width = "20px";
    item3Img.style.height = "20px";
    item3Img.style.paddingRight = "4px";

    const item4Img = document.createElement("img");
    item4Img.style.width = "20px";
    item4Img.style.height = "20px";
    item4Img.style.paddingRight = "4px";

    const item5Img = document.createElement("img");
    item5Img.style.width = "20px";
    item5Img.style.height = "20px";
    item5Img.style.paddingRight = "4px";

    const item6Img = document.createElement("img");
    item6Img.style.width = "20px";
    item6Img.style.height = "20px";
    item6Img.style.paddingRight = "4px";

    const item7Img = document.createElement("img");
    item7Img.style.width = "20px";
    item7Img.style.height = "20px";
    item7Img.style.paddingRight = "4px";
    item7Img.style.borderRadius = "50%";

    const itemSpan = document.createElement("span");

    const matchFifthDiv = document.createElement("div");
    matchFifthDiv.classList.add("match-fifth");

    const partiList1Ul = document.createElement("ul");

    const partiList2Ul = document.createElement("ul");
    
    partiListMaking1(partiList1Ul,k);
    partiListMaking2(partiList2Ul,k);

    const blankDiv = document.createElement("div");

    const openDiv = document.createElement("div");
    openDiv.classList.add("open");

    const openImg = document.createElement("img");
    openImg.src = "/images/down-arrow.svg";
    openImg.style.width = "30px";
    openImg.style.height = "30px";

    const detailDiv = document.createElement("div");
    detailDiv.classList.add("detail");

    const teamBlueWLSpan = document.createElement("span");

    const teamBlueTDBSpan = document.createElement("span");
    teamBlueTDBSpan.classList.add('padding3');
    
    const teamBlueGoldSpan = document.createElement("span");
    teamBlueTDBSpan.classList.add('padding3');
    
    const teamRedGoldSpan = document.createElement("span");
    teamBlueTDBSpan.classList.add('padding3');
    
    const teamRedTDBSpan = document.createElement("span");
    teamBlueTDBSpan.classList.add('padding3');
    
    const teamRedWLSpan = document.createElement("span");

    const detailFirstDiv = document.createElement("div");
    detailFirstDiv.classList.add("detail-first");

    const teamBlueWL = document.createElement("b");
    teamBlueWL.style.fontSize = "20px";
    teamBlueWL.style.paddingRight = "10px";

    const teamBlueSpan = document.createElement("span");
    teamBlueSpan.classList.add("font1");
    teamBlueSpan.textContent = "블루팀";

    const towerBlueSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    towerBlueSvg.style.width = "20px";
    towerBlueSvg.style.height = "20px";
    
    const towerBluePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    towerBluePath.style.width = "20px";
    towerBluePath.style.height = "20px";
    towerBluePath.setAttribute("d", "M13.635 2.5V4.58333H11.1825V2.5H8.81752V4.58333H6.36496V2.5H4V8.75L5.83942 9.25V14.9167L4 15.4167V17.5H16V15.4167L14.073 14.9167V9.25L16 8.75V2.5H13.635ZM11.1825 13.9167H8.81752V10L9.9562 9.16667L11.0949 10V13.9167H11.1825Z");

    const towerBlueSpan = document.createElement("span");
    towerBlueSpan.classList.add("font1");
    towerBlueSpan.textContent = "0";

    const dragonBlueSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    dragonBlueSvg.style.width = "20px";
    dragonBlueSvg.style.height = "20px";

    const dragonBluePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    dragonBluePath.setAttribute("d", "M17.8697 7.08361L15.5522 7.42609C15.4132 7.42609 15.3205 7.38328 15.3205 7.25485L15.1351 3.61605C15.1351 3.48763 15.0424 3.48763 14.9497 3.57324L12.0297 6.27023C11.937 6.35585 11.8443 6.31304 11.7979 6.22742L10.1294 2.28896C10.083 2.16054 10.0367 2.07492 10.0367 2.03211C10.0367 1.9893 10.0367 1.9893 10.0367 2.03211C10.0367 2.03211 9.99032 2.16054 9.94398 2.28896L8.2754 6.22742C8.22905 6.35585 8.13635 6.35585 8.04366 6.27023L5.03096 3.57324C4.93826 3.48763 4.84556 3.53043 4.84556 3.65886L4.66016 7.29766C4.66016 7.42609 4.56746 7.51171 4.42842 7.4689L2.11095 7.12642C1.97191 7.12642 1.97191 7.16923 2.06461 7.25485L4.52111 9.39532C4.61381 9.48094 4.70651 9.65217 4.70651 9.73779L5.12365 12.6916C5.17 13.1625 5.4481 13.5906 5.86524 13.8475C6.60683 14.3612 9.38778 17.8288 9.38778 17.8288C9.48048 17.9144 9.61953 18 9.75858 18C9.89763 18 9.99032 18 9.99032 18C9.99032 18 10.1294 18 10.2221 18C10.3148 18 10.5002 17.9144 10.5929 17.8288C10.5929 17.8288 13.3275 14.3184 14.1154 13.8475C14.5325 13.5906 14.8106 13.1625 14.857 12.6916L15.2741 9.73779C15.2741 9.60936 15.3668 9.43813 15.4595 9.39532L17.916 7.25485C18.0551 7.12642 18.0087 7.08361 17.8697 7.08361ZM8.59985 12.4348C6.74588 11.5786 6.28239 9.43813 6.28239 9.43813L9.06334 11.5786C9.06334 11.5786 9.52683 12.4348 8.59985 12.4348ZM11.3808 12.4348C10.4538 12.4348 10.9173 11.5786 10.9173 11.5786L13.6983 9.43813C13.6983 9.43813 13.2348 11.5786 11.3808 12.4348Z");

    const dragonBlueSpan = document.createElement("span");
    dragonBlueSpan.classList.add("font1");
    dragonBlueSpan.textContent = "0";

    const baronBlueSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    baronBlueSvg.style.width = "20px";
    baronBlueSvg.style.height = "20px";

    const baronBluePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    baronBluePath.setAttribute("d", "M15.0357 8.73753L17 6.16463C17 6.16463 15.5848 4.08573 15.5543 4.01711C15.5543 4.01711 15.5542 4.01711 15.5481 4.01025L12.1625 1.99996C12.1564 1.99996 12.1442 2.00682 12.1503 2.01368C12.1503 2.01368 14.139 4.86789 14.139 4.87475C14.139 4.87475 14.139 6.14404 14.139 6.15091L12.3028 7.02912L10.0091 4.89533L7.70937 7.02912L5.861 6.15777C5.861 6.15091 5.861 4.88161 5.861 4.88161L7.84967 2.02055C7.85577 2.01368 7.84968 1.99996 7.83748 2.00682L4.45185 4.01711C4.45185 4.01711 4.45185 4.01711 4.44575 4.02398C4.41525 4.09259 3 6.17149 3 6.17149L4.96427 8.74439C4.96427 8.74439 4.57995 9.80099 4.44575 10.0823L3.00609 11.4476L6.44662 16.9091L8.61829 18L6.77603 14.6655L7.64226 14.8096L8.6427 15.9554V15.1663L9.04531 15.2075L9.99695 16.4356C9.99695 16.4356 10.9425 15.2075 10.9486 15.2075L11.3512 15.1663V15.9554L12.3516 14.8096L13.2179 14.6655L11.3756 18L13.5473 16.9091L16.9878 11.4476L15.5481 10.0823C15.4261 9.79413 15.0357 8.73753 15.0357 8.73753ZM7.45316 12.2641C6.98954 12.2641 6.61743 11.8387 6.61743 11.3241C6.61743 10.8027 6.98954 10.3842 7.45316 10.3842C7.91678 10.3842 8.28889 10.8027 8.28889 11.3241C8.28889 11.8456 7.91678 12.2641 7.45316 12.2641ZM10.0091 13.7667C9.55163 13.7598 9.18562 13.3413 9.18562 12.8267C9.18562 12.3121 9.55163 11.8936 10.0091 11.8868C10.4667 11.8936 10.8327 12.3121 10.8327 12.8267C10.8327 13.3482 10.4606 13.7598 10.0091 13.7667ZM10.0091 10.3293C9.46623 10.3293 9.02702 9.8353 9.02702 9.22466C9.02702 8.61403 9.46623 8.12003 10.0091 8.12003C10.5521 8.12003 10.9913 8.61403 10.9913 9.22466C10.9852 9.8353 10.546 10.3293 10.0091 10.3293ZM12.559 12.2641C12.0954 12.2641 11.7233 11.8456 11.7233 11.3241C11.7233 10.8027 12.0954 10.3842 12.559 10.3842C13.0227 10.3842 13.3948 10.8027 13.3948 11.3241C13.3948 11.8387 13.0227 12.2641 12.559 12.2641Z");

    const baronBlueSpan = document.createElement("span");
    baronBlueSpan.classList.add("font1");
    baronBlueSpan.textContent = "0";

    const goldBlueImg = document.createElement("img");
    goldBlueImg.src = "/images/yellow-coin-icon-original.svg";
    goldBlueImg.style.width = "20px";
    goldBlueImg.style.height = "20px";
    goldBlueImg.style.paddingRight = "5px";

    const goldBlueB = document.createElement("b");
    goldBlueB.classList.add("font1");
    goldBlueB.textContent = "00.0K";

    const killsBlueB = document.createElement("b");
    killsBlueB.classList.add("font1");
    killsBlueB.style.fontSize = "20px";
    killsBlueB.textContent = "00";
    
    const vsB = document.createElement("b");
    vsB.textContent = "VS";

    const killsRedB = document.createElement("b");
    killsRedB.classList.add("font1");
    killsRedB.style.fontSize = "20px";
    killsRedB.textContent = "00";

    const goldRedImg = document.createElement("img");
    goldRedImg.src = "/images/yellow-coin-icon-original.svg";
    goldRedImg.style.width = "20px";
    goldRedImg.style.height = "20px";
    goldRedImg.style.paddingRight = "5px";

    const goldRedB = document.createElement("b");
    goldRedB.classList.add("font1");
    goldRedB.textContent = "00.0K";

    const towerRedSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    towerRedSvg.style.width = "20px";
    towerRedSvg.style.height = "20px";

    const towerRedPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    towerRedPath.setAttribute("d", "M13.635 2.5V4.58333H11.1825V2.5H8.81752V4.58333H6.36496V2.5H4V8.75L5.83942 9.25V14.9167L4 15.4167V17.5H16V15.4167L14.073 14.9167V9.25L16 8.75V2.5H13.635ZM11.1825 13.9167H8.81752V10L9.9562 9.16667L11.0949 10V13.9167H11.1825Z");

    const towerRedSpan = document.createElement("span");
    towerRedSpan.classList.add("font1");
    towerRedSpan.textContent = "0";

    const dragonRedSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    dragonRedSvg.style.width = "20px";
    dragonRedSvg.style.height = "20px";

    const dragonRedPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    dragonRedPath.setAttribute("d", "M17.8697 7.08361L15.5522 7.42609C15.4132 7.42609 15.3205 7.38328 15.3205 7.25485L15.1351 3.61605C15.1351 3.48763 15.0424 3.48763 14.9497 3.57324L12.0297 6.27023C11.937 6.35585 11.8443 6.31304 11.7979 6.22742L10.1294 2.28896C10.083 2.16054 10.0367 2.07492 10.0367 2.03211C10.0367 1.9893 10.0367 1.9893 10.0367 2.03211C10.0367 2.03211 9.99032 2.16054 9.94398 2.28896L8.2754 6.22742C8.22905 6.35585 8.13635 6.35585 8.04366 6.27023L5.03096 3.57324C4.93826 3.48763 4.84556 3.53043 4.84556 3.65886L4.66016 7.29766C4.66016 7.42609 4.56746 7.51171 4.42842 7.4689L2.11095 7.12642C1.97191 7.12642 1.97191 7.16923 2.06461 7.25485L4.52111 9.39532C4.61381 9.48094 4.70651 9.65217 4.70651 9.73779L5.12365 12.6916C5.17 13.1625 5.4481 13.5906 5.86524 13.8475C6.60683 14.3612 9.38778 17.8288 9.38778 17.8288C9.48048 17.9144 9.61953 18 9.75858 18C9.89763 18 9.99032 18 9.99032 18C9.99032 18 10.1294 18 10.2221 18C10.3148 18 10.5002 17.9144 10.5929 17.8288C10.5929 17.8288 13.3275 14.3184 14.1154 13.8475C14.5325 13.5906 14.8106 13.1625 14.857 12.6916L15.2741 9.73779C15.2741 9.60936 15.3668 9.43813 15.4595 9.39532L17.916 7.25485C18.0551 7.12642 18.0087 7.08361 17.8697 7.08361ZM8.59985 12.4348C6.74588 11.5786 6.28239 9.43813 6.28239 9.43813L9.06334 11.5786C9.06334 11.5786 9.52683 12.4348 8.59985 12.4348ZM11.3808 12.4348C10.4538 12.4348 10.9173 11.5786 10.9173 11.5786L13.6983 9.43813C13.6983 9.43813 13.2348 11.5786 11.3808 12.4348Z");

    const dragonRedSpan = document.createElement("span");
    dragonRedSpan.classList.add("font1");
    dragonRedSpan.textContent = "0";

    const baronRedSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    baronRedSvg.style.width = "20px";
    baronRedSvg.style.height = "20px";

    const baronRedPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    baronRedPath.setAttribute("d", "M15.0357 8.73753L17 6.16463C17 6.16463 15.5848 4.08573 15.5543 4.01711C15.5543 4.01711 15.5542 4.01711 15.5481 4.01025L12.1625 1.99996C12.1564 1.99996 12.1442 2.00682 12.1503 2.01368C12.1503 2.01368 14.139 4.86789 14.139 4.87475C14.139 4.87475 14.139 6.14404 14.139 6.15091L12.3028 7.02912L10.0091 4.89533L7.70937 7.02912L5.861 6.15777C5.861 6.15091 5.861 4.88161 5.861 4.88161L7.84967 2.02055C7.85577 2.01368 7.84968 1.99996 7.83748 2.00682L4.45185 4.01711C4.45185 4.01711 4.45185 4.01711 4.44575 4.02398C4.41525 4.09259 3 6.17149 3 6.17149L4.96427 8.74439C4.96427 8.74439 4.57995 9.80099 4.44575 10.0823L3.00609 11.4476L6.44662 16.9091L8.61829 18L6.77603 14.6655L7.64226 14.8096L8.6427 15.9554V15.1663L9.04531 15.2075L9.99695 16.4356C9.99695 16.4356 10.9425 15.2075 10.9486 15.2075L11.3512 15.1663V15.9554L12.3516 14.8096L13.2179 14.6655L11.3756 18L13.5473 16.9091L16.9878 11.4476L15.5481 10.0823C15.4261 9.79413 15.0357 8.73753 15.0357 8.73753ZM7.45316 12.2641C6.98954 12.2641 6.61743 11.8387 6.61743 11.3241C6.61743 10.8027 6.98954 10.3842 7.45316 10.3842C7.91678 10.3842 8.28889 10.8027 8.28889 11.3241C8.28889 11.8456 7.91678 12.2641 7.45316 12.2641ZM10.0091 13.7667C9.55163 13.7598 9.18562 13.3413 9.18562 12.8267C9.18562 12.3121 9.55163 11.8936 10.0091 11.8868C10.4667 11.8936 10.8327 12.3121 10.8327 12.8267C10.8327 13.3482 10.4606 13.7598 10.0091 13.7667ZM10.0091 10.3293C9.46623 10.3293 9.02702 9.8353 9.02702 9.22466C9.02702 8.61403 9.46623 8.12003 10.0091 8.12003C10.5521 8.12003 10.9913 8.61403 10.9913 9.22466C10.9852 9.8353 10.546 10.3293 10.0091 10.3293ZM12.559 12.2641C12.0954 12.2641 11.7233 11.8456 11.7233 11.3241C11.7233 10.8027 12.0954 10.3842 12.559 10.3842C13.0227 10.3842 13.3948 10.8027 13.3948 11.3241C13.3948 11.8387 13.0227 12.2641 12.559 12.2641Z");

    const baronRedSpan = document.createElement("span");
    baronRedSpan.classList.add("font1");
    baronRedSpan.textContent = "0";

    const detailSecondDiv = document.createElement("div");
    detailSecondDiv.classList.add("detail-second");

    const teamRedWL = document.createElement("b");
    teamRedWL.style.fontSize = "20px";
    teamRedWL.style.paddingLeft = "10px";

    const teamRedSpan = document.createElement("span");
    teamRedSpan.classList.add("font1");
    teamRedSpan.textContent = "레드팀";

    const colgroupBlue = document.createElement("colgroup");
    const colgroupRed = document.createElement("colgroup");
    const colWidths = ["30%", "12%", "10%", "10%", "8%", "30%"];

    colWidths.forEach(width => {
      const col = document.createElement("col");
      col.style.width = width;
      colgroupBlue.appendChild(col);
    });
    colWidths.forEach(width => {
      const col = document.createElement("col");
      col.style.width = width;
      colgroupRed.appendChild(col);
    });

    const trBlue = document.createElement("tr");
    trBlue.style.background = "rgb(57, 58, 60)";
    trBlue.style.borderBottom = "2px solid #626367";
    const trRed = document.createElement("tr");
    trRed.style.background = "rgb(57, 58, 60)";
    trRed.style.borderBottom = "2px solid #626367";
    const thTextsBlue = ["블루팀", "딜량", "KDA", "CS", "와드", "아이템"];
    const thTextsRed = ["블루팀", "딜량", "KDA", "CS", "와드", "아이템"];

    thTextsBlue.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      trBlue.appendChild(th);
    })
    thTextsRed.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      trRed.appendChild(th);
    })

    const dtPartiBlueTable = document.createElement("table");
    dtPartiBlueTable.classList.add('detail-table');
    dtPartiBlueTable.classList.add('blue');
    const dtPartiRedTable = document.createElement("table");
    dtPartiRedTable.classList.add('detail-table');
    dtPartiRedTable.classList.add('red');
    
    //#endregion



    for(let finduser=0; finduser<10; finduser++){
      if(dataSet.get('id') == match[k].get('matchData').participants[finduser].summonerId){
        let owner = match[k].get('matchData').participants[finduser];
        if(owner.win){
          matchDiv.style.backgroundColor = 'rgba(0, 0, 255, 0.3)';   
        } else{
          matchDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        }
        champIconImg.src = version + "img/champion/" + owner.championName + ".png";

        fetch(spellUrl)
        .then(response => response.json())
        .then(data => {
          var spellData = data.data;
          // console.log(spellData);
          function findSpellKey(value) {
            for (let a in spellData) {
              if (spellData[a].key == value) {
                return spellData[a].image.full;
              }
            }
            return null;
          }
          spell1Img.src = version + "img/spell/" + findSpellKey(owner.summoner1Id);
          spell2Img.src = version + "img/spell/" + findSpellKey(owner.summoner2Id);
        })

        fetch(runeUrl)
        .then(response => response.json())
        .then(data => {
          var runeData = data;
          function findRuneKey(value) {
            for (let a = 0; a < runeData.length; a++) {
              if (runeData[a].id == value) {
                return runeData[a].icon;
              }
            }
            return null;
          }
          function findMainRuneKey(value1,value2) {
            for (let a = 0; a < runeData.length; a++) {
              if (runeData[a].id == value1) {
                for (let b = 0; b < runeData[a].slots[0].runes.length; b++) {
                  if (runeData[a].slots[0].runes[b].id == value2) {
                    return runeData[a].slots[0].runes[b].icon;
                  }
                }
                return null;
              }
            }
            return null;
          }
          summoner1IdImg.src = "https://ddragon.leagueoflegends.com/cdn/img/" + findMainRuneKey(owner.perks.styles[0].style,owner.perks.styles[0].selections[0].perk);
          summoner2IdImg.src = "https://ddragon.leagueoflegends.com/cdn/img/" + findRuneKey(owner.perks.styles[1].style);
        })
        kdaDiv.textContent = owner.kills +"/"+ owner.deaths +"/"+ owner.assists;
        avgKDADiv.textContent = ((owner.kills + owner.assists) / owner.deaths).toFixed(1);
        if (owner.teamId == 100){
          killRateSpan.textContent ="킬관여 "+ Math.floor((owner.kills + owner.assists)/match[k].get('matchData').teams[0].objectives.champion.kills*100)+"%  ";
        } else{
          killRateSpan.textContent ="킬관여 "+ Math.floor((owner.kills + owner.assists)/match[k].get('matchData').teams[1].objectives.champion.kills*100)+"%  ";
        }
        CSSpan.textContent = "CS "+ (owner.totalMinionsKilled + owner.neutralMinionsKilled);
        if(owner.item0 != 0){
          item1Img.src = version +"img/item/"+ owner.item0 +".png";
        } else {
          item1Img.src = "/images/item-none.jpg";
          item1Img.style.opacity = '0.3';
        }
        if(owner.item1 != 0){
          item2Img.src = version +"img/item/"+ owner.item1 +".png";
        } else {
          item2Img.src = "/images/item-none.jpg";
          item2Img.style.opacity = '0.3';
        }
        if(owner.item2 != 0){
          item3Img.src = version +"img/item/"+ owner.item2 +".png";
        } else {
          item3Img.src = "/images/item-none.jpg";
          item3Img.style.opacity = '0.3';
        }
        if(owner.item3 != 0){
          item4Img.src = version +"img/item/"+ owner.item3 +".png";
        } else {
          item4Img.src = "/images/item-none.jpg";
          item4Img.style.opacity = '0.3';
        }
        if(owner.item4 != 0){
          item5Img.src = version +"img/item/"+ owner.item4 +".png";
        } else {
          item5Img.src = "/images/item-none.jpg";
          item5Img.style.opacity = '0.3';
        }
        if(owner.item5 != 0){
          item6Img.src = version +"img/item/"+ owner.item5 +".png";
        } else {
          item6Img.src = "/images/item-none.jpg";
          item6Img.style.opacity = '0.3';
        }
        if(owner.item6 != 0){
          item7Img.src = version +"img/item/"+ owner.item6 +".png";
        } else {
          item7Img.src = "/images/item-none.jpg";
          item7Img.style.opacity = '0.3';
        }
      }
    }
    
    var text12 = teamBlueWL;
    var text13 = teamRedWL;
    var pathTB = towerBluePath;
    var pathTR = towerRedPath;
    var pathDB = dragonBluePath;
    var pathDR = dragonRedPath;
    var pathBB = baronBluePath;
    var pathBR = baronRedPath;
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
    var text14 = towerBlueSpan;
    var text15 = dragonBlueSpan;
    var text16 = baronBlueSpan;
    var text17 = towerRedSpan;
    var text18 = dragonRedSpan;
    var text19 = baronRedSpan;
    var text20 = goldBlueB;
    var text21 = goldRedB;
    var text22 = killsBlueB;
    var text23 = killsRedB;

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
    
    matchFirstDiv.appendChild(queueTypeDiv);
    matchFirstDiv.appendChild(matchDateDiv);
    matchFirstDiv.appendChild(matchTimeDiv);

    spellDiv.appendChild(spell1Img);
    spellDiv.appendChild(spell2Img);

    summonerDiv.appendChild(summoner1IdImg);
    summonerDiv.appendChild(summoner2IdImg);
    
    spellAndSummonerSpan.appendChild(spellDiv);
    spellAndSummonerSpan.appendChild(summonerDiv);

    matchSecondDiv.appendChild(champIconImg);
    matchSecondDiv.appendChild(spellAndSummonerSpan);
    
    matchThirdDiv.appendChild(kdaDiv);
    matchThirdDiv.appendChild(avgKDADiv);
    
    killRateAndCSDiv.appendChild(killRateSpan);
    killRateAndCSDiv.appendChild(CSSpan);
    
    itemSpan.appendChild(item1Img);
    itemSpan.appendChild(item2Img);
    itemSpan.appendChild(item3Img);
    itemSpan.appendChild(item4Img);
    itemSpan.appendChild(item5Img);
    itemSpan.appendChild(item6Img);
    itemSpan.appendChild(item7Img);

    matchFourthDiv.appendChild(killRateAndCSDiv);
    matchFourthDiv.appendChild(itemSpan);

    matchFifthDiv.appendChild(partiList1Ul);
    matchFifthDiv.appendChild(partiList2Ul);

    matchDiv.appendChild(matchFirstDiv);
    matchDiv.appendChild(matchSecondDiv);
    matchDiv.appendChild(matchThirdDiv);
    matchDiv.appendChild(matchFourthDiv);
    matchDiv.appendChild(matchFifthDiv);
    matchDiv.appendChild(blankDiv);
    
    openDiv.appendChild(openImg);

    towerBlueSvg.appendChild(towerBluePath);
    dragonBlueSvg.appendChild(dragonBluePath);
    baronBlueSvg.appendChild(baronBluePath);
    towerRedSvg.appendChild(towerRedPath);
    dragonRedSvg.appendChild(dragonRedPath);
    baronRedSvg.appendChild(baronRedPath);

    teamBlueWLSpan.appendChild(teamBlueWL);
    teamBlueWLSpan.appendChild(teamBlueSpan);

    teamBlueTDBSpan.appendChild(towerBlueSvg);
    teamBlueTDBSpan.appendChild(towerBlueSpan);
    teamBlueTDBSpan.appendChild(dragonBlueSvg);
    teamBlueTDBSpan.appendChild(dragonBlueSpan);
    teamBlueTDBSpan.appendChild(baronBlueSvg);
    teamBlueTDBSpan.appendChild(baronBlueSpan);

    teamBlueGoldSpan.appendChild(goldBlueImg);
    teamBlueGoldSpan.appendChild(goldBlueB);
    
    teamRedGoldSpan.appendChild(goldRedImg);
    teamRedGoldSpan.appendChild(goldRedB);

    teamRedTDBSpan.appendChild(towerRedSvg);
    teamRedTDBSpan.appendChild(towerRedSpan);
    teamRedTDBSpan.appendChild(dragonRedSvg);
    teamRedTDBSpan.appendChild(dragonRedSpan);
    teamRedTDBSpan.appendChild(baronRedSvg);
    teamRedTDBSpan.appendChild(baronRedSpan);

    teamRedWLSpan.appendChild(teamRedSpan);
    teamRedWLSpan.appendChild(teamRedWL);
    
    detailFirstDiv.appendChild(teamBlueWLSpan);
    detailFirstDiv.appendChild(teamBlueTDBSpan);
    detailFirstDiv.appendChild(teamBlueGoldSpan);
    detailFirstDiv.appendChild(killsBlueB);
    detailFirstDiv.appendChild(vsB);
    detailFirstDiv.appendChild(killsRedB);
    detailFirstDiv.appendChild(teamRedGoldSpan);
    detailFirstDiv.appendChild(teamRedTDBSpan);
    detailFirstDiv.appendChild(teamRedWLSpan);

    dtPartiBlueTable.appendChild(colgroupBlue);
    dtPartiBlueTable.appendChild(trBlue);

    dtPartiRedTable.appendChild(colgroupRed);
    dtPartiRedTable.appendChild(trRed);

    matchDtFirstBlue(dtPartiBlueTable,k);
    matchDtFirstRed(dtPartiRedTable,k);

    detailSecondDiv.appendChild(dtPartiBlueTable);
    detailSecondDiv.appendChild(dtPartiRedTable);    

    detailDiv.appendChild(detailFirstDiv);
    detailDiv.appendChild(detailSecondDiv);

    gameDiv.appendChild(matchDiv);
    gameDiv.appendChild(openDiv);
    gameDiv.appendChild(detailDiv);
    matchesDiv.appendChild(gameDiv);
  }
}, 1800);


function partiListMaking1(ul,k){
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
    ul.appendChild(childLi);
  }
}
function partiListMaking2(ul,k){
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
    ul.appendChild(childLi);
  }
  // console.log(ulId);
}

function matchDtFirstBlue(Id,k){
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
    // const childImg5 = document.createElement("img");
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
      childImg1.style.paddingRight = "3px";
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
      childImg3.style.paddingRight = "3px";
      childImg3.style.transform = "scale(1.3)";
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
function matchDtFirstRed(Id,k){
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
    // const childImg5 = document.createElement("img");
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

const Num = 4;
function statiMostChamp(){
  //champ kda killrate cs win
  let statiexMostChamp = new Array();
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
  // console.log(filteredArray);
  return filteredArray;
}

function statiMostWholeChamp(){
  //champ kda killrate cs win
  let statiMostWholeChamp = new Array();
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
        statiexSet.set('damagePerMinute',(match[1].get('matchData').participants[3].challenges.damagePerMinute).toFixed(2)); //max: 1500
        statiexSet.set('goldPerMinute',(match[1].get('matchData').participants[3].challenges.goldPerMinute).toFixed(2)); //max:400
        statiexSet.set('visionScorePerMinute',(match[1].get('matchData').participants[3].challenges.visionScorePerMinute).toFixed(2)); //max: 1.5
        if(owner.win == true){
          statiexSet.set('win', 1);
        } else {
          statiexSet.set('win', 0);
        }
        if(owner.teamId == 100){
          statiexSet.set('killsTeam', match[i].get('matchData').teams[0].objectives.champion.kills);
        } else {
          statiexSet.set('killsTeam', match[i].get('matchData').teams[1].objectives.champion.kills);
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
    statiMostWholeChamp[a+1].set('killsTeam', statiMostWholeChamp[a].get('killsTeam')+statiMostWholeChamp[a+1].get('killsTeam'));
  }
  console.log(statiMostWholeChamp[Num-1]);
  return statiMostWholeChamp[Num-1];
}