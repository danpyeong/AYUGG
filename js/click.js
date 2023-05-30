const label = document.querySelector('.label');

label.addEventListener('click', () => {
    if(label.parentNode.classList.contains('active')) {
        label.parentNode.classList.remove('active');
    } else {
        label.parentNode.classList.add('active');
    }
});

function toggleSelectBox(selectBox) {	
    selectBox.classList.toggle("active");
}	

const selectBoxElements = document.querySelectorAll(".select");	
const selectDetailBoxElements = document.querySelectorAll(".game"); 	

selectBoxElements.forEach(selectBoxElement=> {	
    selectBoxElement.addEventListener("click", function(e) {	
        toggleSelectBox(selectBoxElement);	
    });	
});	

selectDetailBoxElements.forEach(selectBoxElement=> {	
    selectBoxElement.addEventListener("click", function(e) {	
        toggleSelectBox(selectBoxElement);	
    });	
});