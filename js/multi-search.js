const apiKey = "RGAPI-6e1b716a-027f-4306-930b-458ee9fb0229";
const SereachByNickStartUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
const TierUrl = "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/";
const version = "https://ddragon.leagueoflegends.com/cdn/13.11.1/";
let textsample = "t1 zeus님이 방에 참가했습니다. 에휴휴휴휴휴님이 방에 참가했습니다. hideonbush님이 방에 참가했습니다. t1 gumayusi님이 방에 참가했습니다. 역천괴님이 방에 참가했습니다."
let textList = textsample.split("님이 방에 참가했습니다.").filter(Boolean);
let encodedName = new Array();
let matchEx = new Array();
let dataList = new Array();

async function loadingData() {
    for(let i=0;i<textList.length;i++){
        encodedName[i] = encodeURI(textList[i]);
        let dataSet = new Object();
        dataSet.matches = new Array();
        let UserUrl = SereachByNickStartUrl + encodedName[i] + "?api_key=" + apiKey;
        rawResult = await fetch(UserUrl)
        .then((response) => {
            return response.json();
        })
        .then(async(rawData)=>{
            let data = Object.values(rawData);
            let UidUrl =  TierUrl + data[0] + "?api_key=" + apiKey;
            let MatchUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/"+ data[2]+"/ids?start=0&count=10&api_key="+apiKey;

            let example1 = await fetch(UidUrl).then((response1) => {
                return response1.json();
            })
            .then((rawData1)=>{
                return rawData1[0];
            })
            let example2 = await fetch(MatchUrl).then((response2) => {
                return response2.json();
            })
            .then(async(rawData2)=>{
                let data2 = Object.values(rawData2);
                for(let j=0;j<5;j++){
                    var ex = await fetch("https://asia.api.riotgames.com/lol/match/v5/matches/"+data2[j]+"?api_key="+apiKey)
                    .then((response2) => {
                        return response2.json();
                    })
                    .then((rawData2)=>{
                        let data3 = Object.values(rawData2);
                        matchEx[j] = data3[1];
                        return matchEx;
                    })
                }
                return ex;
            })

            dataSet.nickname = data[3];
            dataSet.tier = example1.tier;
            dataSet.tiers = example1.tier +" "+ example1.rank+" ("+ example1.leaguePoints +" LP)";
            dataSet.wins = example1.wins;
            dataSet.losses = example1.losses;

            let match = new Array();
            for(let l=0;l<5;l++){
                match[l] = new Object();
                match[l].gameStartTimestamp = example2[l].gameStartTimestamp;
                for(let k=0;k<10;k++){
                    if(data[3] == example2[l].participants[k].summonerName){
                        match[l].championName = example2[l].participants[k].championName;
                        match[l].kills = example2[l].participants[k].kills;
                        match[l].deaths = example2[l].participants[k].deaths;
                        match[l].assists = example2[l].participants[k].assists;
                        match[l].win = example2[l].participants[k].win;
                    }
                }
                dataSet.matches[l] = match[l];
            }
            dataList[i] = dataSet;
        })
    }
}

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

function createBox(i,div){
    const userDiv = document.createElement("div");
    userDiv.classList.add("context");

    const tierImg = document.createElement("img");
    tierImg.src = tierImgMapping.get(dataList[i].tier);
    tierImg.style.width = "30px";
    tierImg.style.height = "30px";

    const nicknameDiv = document.createElement("div");
    nicknameDiv.textContent = dataList[i].nickname;

    const tiersDiv = document.createElement("div");
    tiersDiv.textContent = dataList[i].tiers;

    const winsDiv = document.createElement("div");
    winsDiv.textContent = dataList[i].wins;
    winsDiv.classList.add('win-rate-graph');

    const blankDiv = document.createElement("div");

    const lossesDiv = document.createElement("div");
    lossesDiv.textContent = dataList[i].losses;
    lossesDiv.classList.add('bar');
    lossesDiv.style.width = dataList[i].losses / (dataList[i].wins + dataList[i].losses)*130 +"px";

    const rateDiv = document.createElement("div");
    rateDiv.textContent = Math.floor(dataList[i].wins / (dataList[i].wins + dataList[i].losses)*100) +"%";

    const WLDiv = document.createElement("div");
    WLDiv.style.display = "flex";
    WLDiv.style.justifyContent = "space-around";
    WLDiv.style.alignItems = "center";
    
    winsDiv.appendChild(blankDiv);
    winsDiv.appendChild(lossesDiv);
    WLDiv.appendChild(winsDiv);
    WLDiv.appendChild(rateDiv);

    userDiv.appendChild(tierImg);
    userDiv.appendChild(nicknameDiv);
    userDiv.appendChild(tiersDiv);
    userDiv.appendChild(WLDiv);
    
    let matchNumMax = JSON.parse(JSON.stringify(dataList[i])).matches.length;
    for(let matchNum=0 ; matchNum<matchNumMax;matchNum++){
        matchBoxCreate(i,matchNum,userDiv);
    }

    div.appendChild(userDiv);
}

function matchBoxCreate(i,j, div){
    let eta = new Date();

    const matchDiv = document.createElement("div");
    matchDiv.style.display = "flex";
    matchDiv.style.justifyContent = "space-between";
    matchDiv.style.alignItems = "center";

    const champImg = document.createElement("img");
    champImg.src = version + "img/champion/" + JSON.parse(JSON.stringify(dataList[i])).matches[j].championName + ".png";
    champImg.style.width = "10px";
    champImg.style.height = "10px";

    const KDADiv = document.createElement("div");
    KDADiv.textContent = dataList[i].matches[j].kills +"/"+ dataList[i].matches[j].deaths +"/"+ dataList[i].matches[j].assists;

    const timeDiv = document.createElement("div");
    if(Math.floor((eta.getTime() - dataList[i].matches[j].gameStartTimestamp)/3600000)<24){
        timeDiv.textContent = Math.floor((eta.getTime() - dataList[i].matches[j].gameStartTimestamp)/3600000) + "시간전";
    } else {
        timeDiv.textContent = Math.floor((eta.getTime() - dataList[i].matches[j].gameStartTimestamp)/3600000/24) + "일전";
    }
    matchDiv.appendChild(champImg);
    matchDiv.appendChild(KDADiv);
    matchDiv.appendChild(timeDiv);

    div.appendChild(matchDiv);
}

loadingData().then(()=>{
    const bottomDiv = document.getElementById("result");
    for(let i=0;i<textList.length;i++){
        createBox(i,bottomDiv);
    }
});
