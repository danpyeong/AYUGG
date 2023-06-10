window.onload = function () {
  //#region 입력창 이벤트
  const body = document.querySelector("body");
  const select = document.querySelector("#select-box");
  const option = document.querySelector("#option-list");

  select.addEventListener("click", function (e) {
    e.currentTarget.querySelector("#option-list").style.display = "block";
  });

  body.addEventListener("click", function (e) {
    var target = e.target;

    if (target == e.currentTarget.querySelector("#select-box")) return;
    if (target == e.currentTarget.querySelector("#option-list")) return;
    if (target == e.currentTarget.querySelector(".recent-search")) return;
    if (target == e.currentTarget.querySelector(".favorites")) return;
    if (target == e.currentTarget.querySelector(".option-box")) return;
    if (target == e.currentTarget.querySelector(".user-input-box")) return;

    option.style.display = "none";
  });
  //#endregion

  //#region 입력창 내부 이벤트
  const recentSearch = document.getElementById("recent");
  const favorites = document.getElementById("favorites");

  const recentSearchBox = document.getElementById("recent-box");
  const favoritesBox = document.getElementById("favorites-box");

  recentSearch.addEventListener("click", function () {
    favorites.style.backgroundColor = "rgb(137, 134, 134)";
    recentSearch.style.backgroundColor = "#fff";
    favoritesBox.style.display = "none";
    recentSearchBox.style.display = "block";
  });

  favorites.addEventListener("click", function () {
    recentSearch.style.backgroundColor = "rgb(137, 134, 134)";
    favorites.style.backgroundColor = "#fff";
    recentSearchBox.style.display = "none";
    favoritesBox.style.display = "block";
  });
  //#endregion

  //#region 소환사 이름 입력 이벤트
  const navInput = document.getElementById("nav-input");
  const mainInput = document.getElementById("main-input");

  navInput.addEventListener("keyup", function () {
    if (window.event.keyCode == 13) {
      if (navInput.value == "") {
        return;
      } else {
        // window.location.href =
        //   "/html/player" + encodeURI(userInputBox.value) + ".html";
        window.location.href = "/html/summoners/player.html";
      }
    }
  });

  mainInput.addEventListener("keyup", function () {
    if (window.event.keyCode == 13) {
      if (mainInput.value == "") {
        return;
      } else {
        // window.location.href =
        //   "/html/player/" + encodeURI(mainInput.value) + ".html";
        window.location.href =
          "/html/summoners/player.html?query=" + encodeURI(mainInput.value);
      }
    }
  });

  const navBtn = document.getElementById("nav-button");
  const mainBtn = document.getElementById("main-button");
  navBtn.addEventListener("click", function () {
    if (navInput.value == "") {
      return;
    } else {
      // window.location.href =
      //   "/html/player" + encodeURI(userInputBox.value) + ".html";
      window.location.href = "/html/summoners/player.html";
    }
  });
  mainBtn.addEventListener("click", function () {
    if (mainInput.value == "") {
      return;
    } else {
      // window.location.href =
      //   "/html/player" + encodeURI(userInputBox.value) + ".html";
      window.location.href = "/html/summoners/player.html";
    }
  });
  //#endregion

  //#region 경기 일정 날짜
  let date = new Date();
  let todayMonth = date.getMonth() + 1;
  let todayDate = date.getDate();
  let todayDay = date.getDay();
  const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

  document.getElementById("today-date").innerText =
    todayMonth + "월 " + todayDate + "일" + " (" + WEEKDAY[todayDay] + ")";
  //#endregion

  //#region 경기 내역
  matchUrl = "../json/matchList.json";

  const matchList = document.getElementById("match-list");
  let gameNum;

  fetch(matchUrl)
    .then((response) => response.json())
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        matchData = Object.values(data[i]);

        // gameNum = i;
        gameNum = matchData[0];
        let leftMatchScore = matchData[6];
        let rightMatchScore = matchData[9];
        const childLi = document.createElement("li");
        const childHead = document.createElement("header");
        const childArti = document.createElement("article");
        const childFoot = document.createElement("footer");

        // header ********************************************************
        let gameState = document.createElement("div");
        gameState.id = gameNum + "-game-state";
        // gameState.innerText = "종료";
        let matchGameState = matchData[2];
        switch (matchGameState) {
          case 0:
            gameState.innerText = "종료";
            break;
          case 1:
            gameState.innerText = "진행중";
            break;
          case 2:
            gameState.innerText = "예정";
            break;
        }

        const gameTime = document.createElement("div");
        gameTime.id = gameNum + "-game-time";
        // gameTime.innerText = "23:00";
        gameTime.innerText = matchData[3];

        childHead.appendChild(gameState);
        childHead.appendChild(gameTime);
        // header ********************************************************

        // article ********************************************************
        // --first div
        const leftTeamBox = document.createElement("div");
        const imgLeftTeam = document.createElement("img");
        imgLeftTeam.id = gameNum + "-left-team-img";
        imgLeftTeam.src = matchData[4];
        const nameLeftTeam = document.createElement("div");
        imgLeftTeam.id = gameNum + "-left-team-img";
        nameLeftTeam.innerText = matchData[5];

        leftTeamBox.appendChild(imgLeftTeam);
        leftTeamBox.appendChild(nameLeftTeam);

        // --second div
        const scoreBox = document.createElement("div");
        const scoreLeft = document.createElement("div");
        scoreLeft.id = gameNum + "-left-team-score";
        scoreLeft.innerText = "?";
        // scoreLeft.innerText = matchData[6];

        const scoreMiddle = document.createElement("div");
        scoreMiddle.innerText = ":";

        const scoreRight = document.createElement("div");
        scoreRight.id = gameNum + "-right-team-score";
        scoreRight.innerText = "?";
        // scoreRight.innerText = matchData[9];

        scoreBox.appendChild(scoreLeft);
        scoreBox.appendChild(scoreMiddle);
        scoreBox.appendChild(scoreRight);

        // --third div
        const rightTeamBox = document.createElement("div");
        const imgRightTeam = document.createElement("img");
        imgRightTeam.id = gameNum + "-right-team-img";
        imgRightTeam.src = matchData[7];
        const nameRightTeam = document.createElement("div");
        nameRightTeam.id = gameNum + "-right-team-name";
        nameRightTeam.innerText = matchData[8];

        rightTeamBox.appendChild(nameRightTeam);
        rightTeamBox.appendChild(imgRightTeam);

        childArti.appendChild(leftTeamBox);
        childArti.appendChild(scoreBox);
        childArti.appendChild(rightTeamBox);
        // article ********************************************************

        // footer ********************************************************
        const resultBox = document.createElement("button");
        resultBox.id = gameNum + "-result";
        resultBox.value = 0;
        resultBox.innerText = "결과";
        resultBox.onclick = function () {
          if (matchGameState == 0) {
            if (resultBox.value == 0) {
              document.getElementById(scoreLeft.id).innerText = leftMatchScore;
              document.getElementById(scoreRight.id).innerText =
                rightMatchScore;
              document.getElementById(resultBox.id).innerText = "숨기기";
              document.getElementById(resultBox.id).value = 1;
            } else {
              document.getElementById(scoreLeft.id).innerText = "?";
              document.getElementById(scoreRight.id).innerText = "?";
              document.getElementById(resultBox.id).innerText = "결과";
              document.getElementById(resultBox.id).value = 0;
            }
          } else {
            alert("종료된 게임이 아닙니다.");
          }
        };

        childFoot.appendChild(resultBox);
        // footer ********************************************************

        childLi.appendChild(childHead);
        childLi.appendChild(childArti);
        childLi.appendChild(childFoot);
        matchList.appendChild(childLi);
      }
    });
  //#endregion
};
