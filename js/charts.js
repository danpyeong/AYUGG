const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

var exData = new Map();


setTimeout(function(){

  const rate = document.querySelector("#rate");
  const tierGraph = document.getElementById('tier-graph').getContext('2d');
  const radarGraph = document.getElementById('radar-graph').getContext('2d');
  
  exData.set('wins', sessionStorage.getItem('wins'));
exData.set('losses', sessionStorage.getItem('losses'));
exData.set('tier', sessionStorage.getItem('tier'));// 정수로 변환
var radarGraphData = sessionStorage.getItem('radarGraphData');
var eex = radarGraphData.split(',');

var data = {  
  datasets: [
    {
      label: 'Dataset 1',
      data: [exData.get('wins'),exData.get('losses')],
      backgroundColor: ["#0000ff", "#626367"],
    }
  ]
};

//티어변화 그래프
var tierGraphData = {
  labels: ['S20', 'S21', 'S22'],
  datasets: [{
    label: '티어',
    data: [20,20,20],
    borderColor: 'white',
    borderWidth: 0.2,
    fill: false
  }]
};


//레이더그래프
var radarGraphData = {
  labels: ['KDA', 'CS', '시야', '성장', '전투'],
  datasets: [{
    label: '데이터셋',
    data: eex,
    backgroundColor: 'rgba(255, 165, 0, 0.5)',
    borderColor: '#ffa500',
    pointBorderColor: '#fff',
    pointRadius: 4 ,
    borderWidth: 0.5,
    pointStyle: false,
    pointLabel: null
  }]
};

  new Chart(rate, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      }
    }
  });

  new Chart(tierGraph, {
    type: 'line',
    data: tierGraphData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          grid: {display: false},
          display: false
        },
        x: {
          grid: {display: false},
        }
      }
    }
  });

  new Chart(radarGraph, {
    type: 'radar',
    data: radarGraphData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 80,
          ticks: {
            stepSize: 20,
            display: false,
          },
        }
      }
    }
  });
},1800);