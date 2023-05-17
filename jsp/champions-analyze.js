var btn = document.getElementById("line-top");
btn.addEventListener("click", function (e) {
  document.getElementById("line-top").style.backgroundColor = "blue";
  document.getElementById("line-top").style.color = "white";
  document.getElementById("line-jg").style.backgroundColor = "white";
  document.getElementById("line-jg").style.color = "black";
});

var btn = document.getElementById("line-jg");
btn.addEventListener("click", function (e) {
  document.getElementById("line-jg").style.backgroundColor = "blue";
  document.getElementById("line-jg").style.color = "white";
  document.getElementById("line-top").style.backgroundColor = "white";
  document.getElementById("line-top").style.color = "black";
});
