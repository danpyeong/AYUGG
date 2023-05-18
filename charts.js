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
      borderColor: 'rgb(57, 58, 60)',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  },
});