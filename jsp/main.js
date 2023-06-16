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
    var recent = JSON.parse(localStorage.getItem("recentSearch"));

    if (target == e.currentTarget.querySelector("#select-box")) return;
    if (target == e.currentTarget.querySelector(".option-list")) return;
    if (target == e.currentTarget.querySelector(".recent-search")) return;
    if (target == e.currentTarget.querySelector(".favorites")) return;
    if (target == e.currentTarget.querySelector(".option-box")) return;
    if (target == e.currentTarget.querySelector("#recentBox")) return;
    if (target == e.currentTarget.querySelector("#favoritesBox")) return;
    if (target == e.currentTarget.querySelector(".user-input-box")) return;
    if (recent) {
      for (let i = 0; i < recent.length; i++) {
        if (target == e.currentTarget.querySelector("#recentBox" + i)) return;
        if (target == e.currentTarget.querySelector("#nickName" + i)) return;
        if (target == e.currentTarget.querySelector("#bookMark" + i)) return;
        if (target == e.currentTarget.querySelector("#close" + i)) return;
        if (target == e.currentTarget.querySelector("#svg-img" + i)) return;
        if (target == e.currentTarget.querySelector("#spanBox-recent")) return;
      }
    }
    if (bookMark) {
      for (let i = 0; i < recent.length; i++) {
        if (target == e.currentTarget.querySelector("#bookMarkBox" + i)) return;
        if (target == e.currentTarget.querySelector("#nickName-bookMark" + i))
          return;
        if (target == e.currentTarget.querySelector("#close-bookMark" + i))
          return;
        if (target == e.currentTarget.querySelector("#svg-img-bookMark" + i))
          return;
        if (target == e.currentTarget.querySelector("#spanBox-bookMark"))
          return;
      }
    }

    option.style.display = "none";
  });
  //#endregion

  //#region 입력창 내부 이벤트
  const recentSearch = document.getElementById("recent");
  const favorites = document.getElementById("favorites");

  const recentSearchBox = document.getElementById("recentBox");
  const favoritesBox = document.getElementById("favoritesBox");

  recentSearch.addEventListener("click", function () {
    favorites.style.backgroundColor = "rgb(137, 134, 134)";
    favoritesBox.className = "option-box-off";
    recentSearch.style.backgroundColor = "#fff";
    recentSearchBox.className = "option-box-on";
  });

  favorites.addEventListener("click", function () {
    recentSearch.style.backgroundColor = "rgb(137, 134, 134)";
    recentSearchBox.className = "option-box-off";
    favorites.style.backgroundColor = "#fff";
    favoritesBox.className = "option-box-on";
  });
  //#endregion

  //#region 최근 기록, 즐겨찾기
  //#region  > 최근 기록
  var recent = JSON.parse(localStorage.getItem("recentSearch"));

  if (recent != "" && recent) {
    for (let i = 0; i < recent.length; i++) {
      const divBox = document.createElement("div");
      divBox.className = "data-box";
      divBox.id = "recentBox" + i;
      divBox.style.display = "flex";
      divBox.style.height = "40px";

      const imgBox1 = document.createElement("div");
      imgBox1.className = "img-box";
      const img1 = document.createElement("img");
      img1.src = "#";
      img1.id = "svg-img" + i;
      img1.style.cursor = "initial";

      const imgBox2 = document.createElement("div");
      imgBox2.className = "img-box";
      const img2 = document.createElement("img");
      if (recent[i].state == true)
        img2.src = "/images/bookMark-icon/icon-bookmark-on-yellow.svg";
      else img2.src = "/images/bookMark-icon/icon-bookmark.svg";
      img2.id = "bookMark" + i;

      const imgBox3 = document.createElement("div");
      imgBox3.className = "img-box";
      const img3 = document.createElement("img");
      img3.src = "/images/bookMark-icon/icon-close-small.svg";
      img3.id = "close" + i;

      const nickNameBox = document.createElement("div");
      nickNameBox.className = "name-box";
      const nickName = document.createElement("div");
      nickName.id = "nickName" + i;
      nickName.innerText = recent[i].nickName;
      nickName.style.cursor = "pointer";
      nickName.src = "";

      imgBox1.appendChild(img1);
      imgBox2.appendChild(img2);
      imgBox3.appendChild(img3);
      divBox.appendChild(imgBox1);
      nickNameBox.appendChild(nickName);
      divBox.appendChild(nickNameBox);
      divBox.appendChild(imgBox2);
      divBox.appendChild(imgBox3);

      //#region  >> 즐겨찾기 추가 및 삭제
      img2.addEventListener("click", function (e) {
        const url = "http://127.0.0.1:5500";
        if (img2.src == url + "/images/bookMark-icon/icon-bookmark.svg") {
          img2.src = "/images/bookMark-icon/icon-bookmark-on-yellow.svg";

          var bookMarkData = JSON.parse(localStorage.getItem("bookMark"));
          var value = [];
          var data = {
            nickName: nickName.textContent,
            state: true,
          };

          if (!bookMarkData) {
            value.push(data);
            localStorage.setItem("bookMark", JSON.stringify(value));
            for (var j = 0; j < recent.length; j++) {
              if (recent[j].nickName == nickName.textContent) {
                recent[j] = data;
                localStorage.setItem("recentSearch", JSON.stringify(recent));
                return;
              }
            }
            localStorage.setItem("recentSearch", JSON.stringify(recent));
          } else {
            bookMarkData.push(data);
            localStorage.setItem("bookMark", JSON.stringify(bookMarkData));
            for (var j = 0; j < recent.length; j++) {
              if (recent[j].nickName == nickName.textContent) {
                recent[j] = data;
                localStorage.setItem("recentSearch", JSON.stringify(recent));
                return;
              }
            }
          }
          favoritesBox.appendChild(divBox);
        } else {
          img2.src = "/images/bookMark-icon/icon-bookmark.svg";
          var bookMarkData = JSON.parse(localStorage.getItem("bookMark"));
          var data = {
            nickName: nickName.textContent,
            state: false,
          };
          for (var j = 0; j < bookMarkData.length; j++) {
            if (bookMarkData[j].nickName == nickName.textContent) {
              bookMarkData.splice(j, 1);
              j--;
              localStorage.setItem("bookMark", JSON.stringify(bookMarkData));
            }
          }
          for (var j = 0; j < recent.length; j++) {
            if (recent[j].nickName == nickName.textContent) {
              recent[j] = data;
              localStorage.setItem("recentSearch", JSON.stringify(recent));
              return;
            }
          }
        }
      });
      //#endregion 즐겨찾기 추가 및 삭제

      //#region  >> 최근 기록 삭제
      img3.addEventListener("click", function (e) {
        for (var j = 0; j < recent.length; j++) {
          if (recent[i].nickName == nickName.textContent) {
            recent.splice(j, 1);
            j--;
            localStorage.setItem("recentSearch", JSON.stringify(recent));
          }
        }
        recentSearchBox.remove(divBox);
      });
      //#endregion 최근 기록 삭제

      recentSearchBox.appendChild(divBox);
    }
  } else {
    const spanBox = document.createElement("span");
    spanBox.className = "spanBox";
    spanBox.innerText = "최근 검색한 소환사가 없습니다.";
    spanBox.id = "spanBox-recent";
    if (recentSearchBox.childElementCount == 0) {
      recentSearchBox.appendChild(spanBox);
    }
  }
  //#endregion  최근 기록

  //#region  > 즐겨찾기
  var bookMark = JSON.parse(localStorage.getItem("bookMark"));

  if (bookMark != "" && bookMark) {
    for (let i = 0; i < bookMark.length; i++) {
      const divBox = document.createElement("div");
      divBox.className = "data-box";
      divBox.id = "bookMarkBox" + i;
      divBox.style.display = "flex";
      divBox.style.height = "40px";

      const imgBox1 = document.createElement("div");
      imgBox1.className = "img-box";
      const img1 = document.createElement("img");
      img1.src = "#";
      img1.id = "svg-img-bookMark" + i;
      img1.style.cursor = "initial";

      const imgBox3 = document.createElement("div");
      imgBox3.className = "img-box";
      const img3 = document.createElement("img");
      img3.src = "/images/bookMark-icon/icon-close-small.svg";
      img3.id = "close-bookMark" + i;

      const nickNameBox = document.createElement("div");
      nickNameBox.className = "name-box2";
      const nickName = document.createElement("div");
      nickName.id = "nickName-bookMark" + i;
      nickName.innerText = bookMark[i].nickName;
      nickName.style.cursor = "pointer";
      nickName.src = "";

      imgBox1.appendChild(img1);
      imgBox3.appendChild(img3);
      divBox.appendChild(imgBox1);
      nickNameBox.appendChild(nickName);
      divBox.appendChild(nickNameBox);
      divBox.appendChild(imgBox3);

      //#region  >> 즐겨찾기 삭제
      img3.addEventListener("click", function (e) {
        for (var j = 0; j < bookMark.length; j++) {
          if (bookMark[j].nickName == nickName.textContent) {
            bookMark.splice(j, 1);
            j--;
            localStorage.setItem("bookMark", JSON.stringify(bookMark));
          }
        }
        for (var j = 0; j < recent.length; j++) {
          if (recent[j].nickName == nickName.textContent) {
            var data = {
              nickName: nickName.textContent,
              state: false,
            };
            recent[j] = data;
            localStorage.setItem("recentSearch", JSON.stringify(recent));
          }
        }
        favoritesBox.remove(divBox);
      });
      //#endregion 즐겨찾기 삭제

      favoritesBox.appendChild(divBox);
    }
  } else {
    const spanBox = document.createElement("span");
    spanBox.className = "spanBox";
    spanBox.id = "spanBox-bookMark";
    spanBox.innerText = "즐겨찾기 내역이 없습니다.";
    if (favoritesBox.childElementCount == 0) {
      favoritesBox.appendChild(spanBox);
    }
  }
  //#endregion  즐겨찾기
  //#endregion 최근 기록, 즐겨찾기

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
        window.location.href = "/html/player.html";
        sessionStorage.setItem("nickname", mainInput.value);
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
        window.location.href = "/html/player.html";
        sessionStorage.setItem("nickname", mainInput.value);
        localStorage.setItem("search", mainInput.value);
        var value = [];
        var recent = JSON.parse(localStorage.getItem("recentSearch"));
        if (!recent) {
          var data = {
            nickName: mainInput.value,
            state: false,
          };
          value.push(data);
          localStorage.setItem("recentSearch", JSON.stringify(value));
        } else {
          var data = {
            nickName: mainInput.value,
            state: false,
          };
          recent.push(data);
          localStorage.setItem("recentSearch", JSON.stringify(recent));
        }
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
      window.location.href = "/html/player.html";
    }
  });
  mainBtn.addEventListener("click", function () {
    if (mainInput.value == "") {
      return;
    } else {
      // window.location.href =
      //   "/html/player" + encodeURI(userInputBox.value) + ".html";
      window.location.href = "/html/player.html";
      localStorage.setItem("recentSearch", mainInput.value);
      if (!recent) {
        value.push(mainInput.value);
        localStorage.setItem("recentSearch", JSON.stringify(value));
      } else {
        recent.push(mainInput.value);
        localStorage.setItem("recentSearch", JSON.stringify(recent));
      }
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
