<script>
  var rune = document.getElementById("rune-1");
  rune.addEventListener("click", function (e) {
    document.getElementById("rune-1").style.borderLeft = "3px solid red";
    document.getElementById("rune-2").style.borderLeft = "none";
  });

  var rune2 = document.getElementById("rune-2");
  rune2.addEventListener("click", function (e) {
    document.getElementById("rune-2").style.borderLeft = "3px solid red";
    document.getElementById("rune-1").style.borderLeft = "none";
  });
</script>
