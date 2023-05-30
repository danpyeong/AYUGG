var apiKey = "RGAPI-df8af533-5da6-4e36-b93f-f5ca466ee8fb";

const version = "https://ddragon.leagueoflegends.com/cdn/13.10.1/";

const championUrl = version + "data/ko_KR/champion.json";

const itemDataUrl = version + "data/ko_KR/item.json";

const itemImgUrl = version + "img/item/";

request_header = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://developer.riotgames.com",
  "X-Riot-Token": apiKey,
};

fetch(itemDataUrl)
  .then((response) => response.json())
  .then(function (data) {
    console.log(data);

    // // 모든 챔피언 데이터
    // var champData = data.data;
    // // 위 데이터를 담은 배열
    // var champDataList = Object.values(champData);
    // var champList = document.getElementById("champions-list");
    // for (var i = 0; i < champDataList.length; i++) {
    //   console.log(champDataList[i]);
    //   const childLi = document.createElement("li");
    //   const childSpan = document.createElement("span");
    //   const childImg = document.createElement("img");
    //   const childDiv = document.createElement("div");
    //   const champName = champDataList[i].id.toString().toLowerCase();
    // 챔피언 초상화
    //   childImg.src = version + "img/champion/" + champDataList[i].image.full;
    //   childImg.width = 24;
    //   childImg.height = 24;
    // 챔피언 이름
    //   childDiv.textContent = champDataList[i].name;
    //   childSpan.onclick = function () {
    //     // fs.rename("details.html", champName + ".html", function (err) {
    //     //   if (err) throw err;
    //     //   console.log("File Renamed.");
    //     // });
    //     window.location.href = champName + ".html";
    //   };
    //   childSpan.appendChild(childImg);
    //   childSpan.appendChild(childDiv);
    //   childLi.appendChild(childSpan);
    //   champList.appendChild(childLi);
  });
