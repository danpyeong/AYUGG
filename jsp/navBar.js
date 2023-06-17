const navInput = document.getElementById("nav-input");
const navBtn = document.getElementById("nav-button");

navInput.addEventListener("keyup", function () {
  if (window.event.keyCode == 13) {
    if (navInput.value == "") {
      return;
    } else {
      // window.location.href =
      //   "/html/player" + encodeURI(userInputBox.value) + ".html";
      window.location.href = "/html/player.html";
      sessionStorage.setItem("nickname", mainInput.value);
      recentEvent(navInput.value);
    }
  }
});

navBtn.addEventListener("click", function () {
  if (navInput.value == "") {
    return;
  } else {
    // window.location.href =
    //   "/html/player" + encodeURI(userInputBox.value) + ".html";
    window.location.href = "/html/player.html";
    sessionStorage.setItem("nickname", mainInput.value);
    recentEvent(navInput.value);
  }
});

function recentEvent(input) {
  var value = [];
  var recent = JSON.parse(localStorage.getItem("recentSearch"));
  if (!recent) {
    var data = {
      nickName: input,
      state: false,
    };
    value.push(data);
    localStorage.setItem("recentSearch", JSON.stringify(value));
  } else {
    var data = {
      nickName: input,
      state: false,
    };
    recent.push(data);
    localStorage.setItem("recentSearch", JSON.stringify(recent));
  }
}
