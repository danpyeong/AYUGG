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