import axios from "axios";

// JSON 파일을 가져오는 함수
function fetchJSONFile(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.send(null);
}

// JSON 파일 가져오기
fetchJSONFile(
  "../dragontail/dragontail-13.10.1/13.10.1/data/ko_KR/championFull.json",
  function (response) {
    var jsonData = JSON.parse(response);

    // 가져온 JSON 데이터를 활용하여 작업 수행
    // 예: jsonData 객체를 반복하거나 특정 필드에 접근

    console.log(jsonData);
  }
);
