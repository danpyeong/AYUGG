const label = document.querySelector('.label');

label.addEventListener('click', () => {
    if(label.parentNode.classList.contains('active')) {
        label.parentNode.classList.remove('active');
    } else {
        label.parentNode.classList.add('active');
    }
});

setTimeout(() => {  
    const selectBoxElements = document.querySelectorAll(".detail");
    const selectDetailBoxElements = document.querySelectorAll(".game");
  
    for (let i = 0; i < selectDetailBoxElements.length; i++) {
      selectDetailBoxElements[i].addEventListener("click", function (e) {
        selectBoxElements[i].classList.toggle("active");
      });
    }
  }, 2501);

const refreshButton = document.getElementById('refreshButton');

refreshButton.addEventListener('click', function() {
  location.reload();
});