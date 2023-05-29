let date = new Date();
let todayMonth = date.getMonth() + 1;
let todayDate = date.getDate();
let todayDay = date.getDay();
const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

// window.onload = function () {
//   document.getElementById("today-date").innerText =
//     todayMonth + "월 " + todayDate + "일" + " (" + WEEKDAY[todayDay] + ")";
// };
matchUrl = "../test_junwan/test.json";
fetch(matchUrl)
  .then((response) => response.json())
  .then(function (data) {});

window.onload = function () {
  document.getElementById("today-date").innerText =
    todayMonth + "월 " + todayDate + "일" + " (" + WEEKDAY[todayDay] + ")";

  const matchList = document.getElementById("match-list");
  let gameNum = 0;

  fetch(matchUrl)
    .then((response) => response.json())
    .then(function (data) {
      console.log(data[0]);

      for (let i = 0; i < data.length; i++) {
        matchData = Object.values(data[i]);
        for (let i = 0; i < matchData.length; i++) {
          console.log(matchData[i]);
        }
        // gameNum = i;
        gameNum = matchData[0];
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
        // imgLeftTeam.src =
        //   "https://s-qwer.op.gg/images/lol/teams/385_1672191948431.png?image=q_auto,f_webp,w_80&v=1684919904860";
        imgLeftTeam.src = matchData[4];
        const nameLeftTeam = document.createElement("div");
        imgLeftTeam.id = gameNum + "-left-team-img";
        // nameLeftTeam.innerText = "SKT T1";
        nameLeftTeam.innerText = matchData[5];

        leftTeamBox.appendChild(imgLeftTeam);
        leftTeamBox.appendChild(nameLeftTeam);

        // --second div
        const scoreBox = document.createElement("div");
        const scoreLeft = document.createElement("div");
        scoreLeft.id = gameNum + "-left-team-score";
        scoreLeft.innerText = "?";

        const scoreMiddle = document.createElement("div");
        scoreMiddle.innerText = ":";

        const scoreRight = document.createElement("div");
        scoreRight.id = gameNum + "-right-team-score";
        scoreRight.innerText = "?";

        scoreBox.appendChild(scoreLeft);
        scoreBox.appendChild(scoreMiddle);
        scoreBox.appendChild(scoreRight);

        // --third div
        const rightTeamBox = document.createElement("div");
        const imgRightTeam = document.createElement("img");
        // imgRightTeam.id = gameNum + "-right-team-img";
        // imgRightTeam.src =
        //   "https://s-qwer.op.gg/images/lol/teams/385_1672191948431.png?image=q_auto,f_webp,w_80&v=1684919904860";
        imgRightTeam.src = matchData[7];
        const nameRightTeam = document.createElement("div");
        nameRightTeam.id = gameNum + "-right-team-name";
        // nameRightTeam.innerText = "Gen G";
        nameRightTeam.innerText = matchData[8];

        rightTeamBox.appendChild(nameRightTeam);
        rightTeamBox.appendChild(imgRightTeam);

        childArti.appendChild(leftTeamBox);
        childArti.appendChild(scoreBox);
        childArti.appendChild(rightTeamBox);
        // article ********************************************************

        // footer ********************************************************
        resultBox = document.createElement("div");
        resultBox.id = gameNum + "-result";
        resultBox.innerText = "결과";

        childFoot.appendChild(resultBox);
        // footer ********************************************************

        childLi.appendChild(childHead);
        childLi.appendChild(childArti);
        childLi.appendChild(childFoot);
        matchList.appendChild(childLi);
      }
    });
};
