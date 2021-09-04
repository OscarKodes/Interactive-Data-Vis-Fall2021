
// Declare Variables ================

let count = 0;
let countDisplay = document.querySelector(".counter-display");
const addBtn = document.querySelector(".add-btn");


// Add Event Listeners ==============

addBtn.onclick = () => {
    count++;
    updateDisplay();
}


// Declare Functions ================

const updateDisplay = () => countDisplay.innerText = count;


// Call Function on Startup =========

updateDisplay();