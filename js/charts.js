const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const data = {  
  datasets: [
    {
      label: 'Dataset 1',
      data: [40,60],
      backgroundColor: ["#0000ff", "#626367"],
    }
  ]
};

const rate = document.querySelector("#rate");

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
<<<<<<< HEAD:js/charts.js
  }
});

//티어변화 그래프
var tierGraphData = {
  labels: ['1월', '2월', '3월', '4월'],
  datasets: [{
    label: '판매량',
    data: [20, 30, 25, 35],
    borderColor: 'white',
    borderWidth: 0.2,
    fill: false
  }]
};

var tierGraph = document.getElementById('tier-graph').getContext('2d');

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

//레이더그래프
var radarGraphData = {
  labels: ['15분 골드차이', '생존', '시야', '성장', '전투'],
  datasets: [{
    label: '데이터셋',
    data: [10, 5, 15, 7, 12],
    backgroundColor: 'rgba(255, 165, 0, 0.5)',
    borderColor: '#ffa500',
    pointBorderColor: '#fff',
    pointRadius: 4 ,
    borderWidth: 0.5,
    pointStyle: false,
    pointLabel: null
  }]
};

var radarGraph = document.getElementById('radar-graph').getContext('2d');

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
        suggestedMax: 20,
        ticks: {
          stepSize: 5,
          display: false,
        },
      }
    }
  }
=======
  },
>>>>>>> 7ae2cbf5f6e4301ad6c3548e4a345d9c36c7abbd:charts.js
});