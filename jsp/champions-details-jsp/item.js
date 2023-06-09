const itemUrl = "../../../json/item.json";

fetch(itemUrl)
  .then((response) => response.json())
  .then(function (rawData) {
    // 데이터를 받아서 .Garen 자리에 .변수 하여 해당 값을 넣는다.
    // 이때 변수는 챔피언 id(영어이름)이 들어간다.
    let championId = "Garen";
    let data = Object.values(rawData);
    let championData;

    for (let i = 0; i < data.length; i++) {
      if (data[i].id == championId) {
        championData = data[i].data;
        break;
      }
    }

    const spellUrl =
      "http://ddragon.leagueoflegends.com/cdn/13.11.1/img/spell/";
    const itemUrl = "http://ddragon.leagueoflegends.com/cdn/13.11.1/img/item/";

    //#region 스펠 선호도
    const spellAData = championData.spell.version1;
    const spellBData = championData.spell.version2;

    //#region 스펠 이미지
    const spellA1 = document.getElementById("spell-1-1");
    spellA1.src = spellUrl + spellAData.spell1.id + ".png";
    const spellA2 = document.getElementById("spell-1-2");
    spellA2.src = spellUrl + spellAData.spell2.id + ".png";
    const spellB1 = document.getElementById("spell-2-1");
    spellB1.src = spellUrl + spellBData.spell1.id + ".png";
    const spellB2 = document.getElementById("spell-2-2");
    spellB2.src = spellUrl + spellBData.spell2.id + ".png";
    //#endregion

    //#region 스펠 픽/승률
    const spellPick1 = document.getElementById("spell-pick-1");
    spellPick1.innerText = spellAData.pickRate;
    const spellPick2 = document.getElementById("spell-pick-2");
    spellPick2.innerText = spellBData.pickRate;
    const spellWin1 = document.getElementById("spell-win-1");
    spellWin1.innerText = spellAData.winRate;
    const spellWin2 = document.getElementById("spell-win-2");
    spellWin2.innerText = spellBData.winRate;
    //#endregion
    //#endregion

    //#region 시작 아이템 선호도
    const startItemAData = championData.startItem.version1;
    const startItemBData = championData.startItem.version2;

    //#region 시작 아이템 이미지
    const itemA1 = document.getElementById("item-1-1");
    itemA1.src = itemUrl + startItemAData.item1.id + ".png";
    const itemA2 = document.getElementById("item-1-2");
    itemA2.src = itemUrl + startItemAData.item2.id + ".png";
    const itemB1 = document.getElementById("item-2-1");
    itemB1.src = itemUrl + startItemBData.item1.id + ".png";
    const itemB2 = document.getElementById("item-2-2");
    itemB2.src = itemUrl + startItemBData.item2.id + ".png";
    //#endregion

    //#region 시작 아이템 승/픽률
    const itemPick1 = document.getElementById("item-pick-1");
    itemPick1.innerText = startItemAData.pickRate;
    const itemPick2 = document.getElementById("item-pick-2");
    itemPick2.innerText = startItemAData.winRate;
    const itemWin1 = document.getElementById("item-win-1");
    itemWin1.innerText = startItemBData.pickRate;
    const itemWin2 = document.getElementById("item-win-2");
    itemWin2.innerText = startItemBData.winRate;
    //#endregion
    //#endregion

    //#region 신발 선호도
    const shoesAData = championData.shoes.version1;
    const shoesBData = championData.shoes.version2;

    //#region 신발 이미지
    const shoes1 = document.getElementById("shoes-1");
    shoes1.src = itemUrl + shoesAData.id + ".png";
    const shoesName1 = document.getElementById("shoes-name-1");
    shoesName1.innerText = shoesAData.name;
    const shoes2 = document.getElementById("shoes-2");
    shoes2.src = itemUrl + shoesBData.id + ".png";
    const shoesName2 = document.getElementById("shoes-name-2");
    shoesName2.innerText = shoesBData.name;
    //#endregion

    //#region 신발 승/픽률
    const shoesPick1 = document.getElementById("shoes-pick-1");
    shoesPick1.innerText = shoesAData.pickRate;
    const shoesPick2 = document.getElementById("shoes-pick-2");
    shoesPick2.innerText = shoesBData.pickRate;
    const shoesWin1 = document.getElementById("shoes-win-1");
    shoesWin1.innerText = shoesAData.winRate;
    const shoesWin2 = document.getElementById("shoes-win-2");
    shoesWin2.innerText = shoesBData.winRate;

    //#endregion

    //#endregion

    //#region 아이템 빌드
    const mythicBuild1Data = championData.mythicBuild.mythic1;
    const mythicBuild2Data = championData.mythicBuild.mythic2;

    const legend1 = championData.legend1;
    const legend2 = championData.legend2;

    const mythicImg1 = document.getElementById("mythic-item-1");
    mythicImg1.src = itemUrl + mythicBuild1Data.id + ".png";
    const mythicName1 = document.getElementById("mythic-item-1-name");
    mythicName1.innerText = mythicBuild1Data.name;

    const mythicImg2 = document.getElementById("mythic-item-2");
    mythicImg2.src = itemUrl + mythicBuild2Data.id + ".png";
    const mythicName2 = document.getElementById("mythic-item-2-name");
    mythicName2.innerText = mythicBuild2Data.name;

    // 신화템 추천 빌드
    //#region A
    //#region A-1
    const mythicBuildA1M = document.getElementById("detail-1-build-mythic-a");
    mythicBuildA1M.src = itemUrl + mythicBuild1Data.id + ".png";
    const mythicBuildA1L1 = document.getElementById(
      "detail-1-build-legend-a-1"
    );
    mythicBuildA1L1.src = itemUrl + mythicBuild1Data.version1.legend1 + ".png";
    const mythicBuildA1L2 = document.getElementById(
      "detail-1-build-legend-a-2"
    );
    mythicBuildA1L2.src = itemUrl + mythicBuild1Data.version1.legend2 + ".png";
    const mythicBuildA1Pick = document.getElementById("item-pick-rate-a-1");
    mythicBuildA1Pick.innerText = mythicBuild1Data.version1.pickRate;
    const mythicBuildA1Win = document.getElementById("item-win-rate-a-1");
    mythicBuildA1Win.innerText = mythicBuild1Data.version1.winRate;
    //#endregion
    //#region A-2
    const mythicBuildA2M = document.getElementById("detail-2-build-mythic-a");
    mythicBuildA2M.src = itemUrl + mythicBuild1Data.id + ".png";
    const mythicBuildA2L1 = document.getElementById(
      "detail-2-build-legend-a-1"
    );
    mythicBuildA2L1.src = itemUrl + mythicBuild1Data.version2.legend1 + ".png";
    const mythicBuildA2L2 = document.getElementById(
      "detail-2-build-legend-a-2"
    );
    mythicBuildA2L2.src = itemUrl + mythicBuild1Data.version2.legend2 + ".png";
    const mythicBuildA2Pick = document.getElementById("item-pick-rate-a-2");
    mythicBuildA2Pick.innerText = mythicBuild1Data.version2.pickRate;
    const mythicBuildA2Win = document.getElementById("item-win-rate-a-2");
    mythicBuildA2Win.innerText = mythicBuild1Data.version2.winRate;
    //#endregion
    //#endregion

    //#region B
    //#region B-1
    const mythicBuildB1M = document.getElementById("detail-1-build-mythic-b");
    mythicBuildB1M.src = itemUrl + mythicBuild2Data.id + ".png";
    const mythicBuildB1L1 = document.getElementById(
      "detail-1-build-legend-b-1"
    );
    mythicBuildB1L1.src = itemUrl + mythicBuild2Data.version1.legend1 + ".png";
    const mythicBuildB1L2 = document.getElementById(
      "detail-1-build-legend-b-2"
    );
    mythicBuildB1L2.src = itemUrl + mythicBuild2Data.version1.legend2 + ".png";
    const mythicBuildB1Pick = document.getElementById("item-pick-rate-b-1");
    mythicBuildB1Pick.innerText = mythicBuild2Data.version1.pickRate;
    const mythicBuildB1Win = document.getElementById("item-win-rate-b-1");
    mythicBuildB1Win.innerText = mythicBuild2Data.version1.winRate;
    //#endregion
    //#region B-2
    const mythicBuildB2M = document.getElementById("detail-2-build-mythic-b-1");
    mythicBuildB2M.src = itemUrl + mythicBuild2Data.id + ".png";
    const mythicBuildB2L1 = document.getElementById(
      "detail-2-build-legend-b-1"
    );
    mythicBuildB2L1.src = itemUrl + mythicBuild2Data.version2.legend1 + ".png";
    const mythicBuildB2L2 = document.getElementById(
      "detail-2-build-legend-b-2"
    );
    mythicBuildB2L2.src = itemUrl + mythicBuild2Data.version2.legend2 + ".png";
    const mythicBuildB2Pick = document.getElementById("item-pick-rate-b-2");
    mythicBuildB2Pick.innerText = mythicBuild2Data.version2.pickRate;
    const mythicBuildB2Win = document.getElementById("item-win-rate-b-2");
    mythicBuildB2Win.innerText = mythicBuild2Data.version2.winRate;
    //#endregion
    //#endregion

    // 전설 추천 아이템
    //#region A
    const legendImgA1 = document.getElementById("img-legend-a-1");
    legendImgA1.src = itemUrl + legend1.id + ".png";
    const legendNameA1 = document.getElementById("img-legend-name-a-1");
    legendNameA1.innerText = legend1.name;
    const legendPickA1 = document.getElementById("legend-item-pick-rate-a-1");
    legendPickA1.innerText = legend1.pickRate;
    const legendWinA1 = document.getElementById("legend-item-win-rate-a-1");
    legendWinA1.innerText = legend1.winRate;

    const legendImgA2 = document.getElementById("img-legend-a-2");
    legendImgA2.src = itemUrl + legend2.id + ".png";
    const legendNameA2 = document.getElementById("img-legend-name-a-2");
    legendNameA2.innerText = legend2.name;
    const legendPickA2 = document.getElementById("legend-item-pick-rate-a-2");
    legendPickA2.innerText = legend2.pickRate;
    const legendWinA2 = document.getElementById("legend-item-win-rate-a-2");
    legendWinA2.innerText = legend2.winRate;
    //#endregion
    //#region B
    const legendImgB1 = document.getElementById("img-legend-b-1");
    legendImgB1.src = itemUrl + legend1.id + ".png";
    const legendNameB1 = document.getElementById("img-legend-name-b-1");
    legendNameB1.innerText = legend1.name;
    const legendPickB1 = document.getElementById("legend-item-pick-rate-b-1");
    legendPickB1.innerText = legend1.pickRate;
    const legendWinB1 = document.getElementById("legend-item-win-rate-b-1");
    legendWinB1.innerText = legend1.winRate;

    const legendImgB2 = document.getElementById("img-legend-b-2");
    legendImgB2.src = itemUrl + legend2.id + ".png";
    const legendNameB2 = document.getElementById("img-legend-name-b-2");
    legendNameB2.innerText = legend2.name;
    const legendPickB2 = document.getElementById("legend-item-pick-rate-b-2");
    legendPickB2.innerText = legend2.pickRate;
    const legendWinB2 = document.getElementById("legend-item-win-rate-b-2");
    legendWinB2.innerText = legend2.winRate;
    //#endregion

    //#endregion
  });
