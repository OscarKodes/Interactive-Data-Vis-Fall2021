
// COUNTER ==========================================

// Variables 
let count = 0;
let countDisplay = document.querySelector(".counter-display");
const addBtn = document.querySelector(".add-btn");


// click add button to increment by 1
addBtn.onclick = () => {
    count++;
    countDisplay.innerText = count;
};



// INPUT FORMS INTO SAVED OBJECT =====================

// Variables 
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const driveInput = document.querySelector("#drive-input");
const submitBtn = document.querySelector(".submit-btn");
const nameDisplay = document.querySelector(".name-display");
const emailDisplay = document.querySelector(".email-display");
const driveDisplay = document.querySelector(".drive-display");
let userObj;


// click to display submitted info
submitBtn.onclick = () => {

    // Save submitted information into object
    userObj = {
        myName: nameInput.value,
        email: emailInput.value,
        license: driveInput.checked
    };

    // Display object's information as inner text
    nameDisplay.innerText = `Name: ${userObj.myName}`;
    emailDisplay.innerText = `Email: ${userObj.email}`;
    driveDisplay.innerText = `License: ${userObj.license ? 'Yes' : 'No'}`;
};


// D3 EXPERIMENTATION ================================

const colorBtn = document.querySelector(".color-btn");
const bgColorBtn = document.querySelector(".bg-color-btn")

const randomColor = (s, l) => `hsl( ${Math.random() * 360}, ${s}%, ${l}%`;

colorBtn.onclick = () => {
    d3.selectAll(".d3-play p")
    .style("color", randomColor(100, 30));
}

bgColorBtn.onclick = () => {
    d3.select("body")
    .style("background-color", randomColor(25, 90));
}








