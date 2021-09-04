
// DECLARE VARIABLES ==========================================

// Variables for counter
let count = 0;
let countDisplay = document.querySelector(".counter-display");
const addBtn = document.querySelector(".add-btn");

// Variables for input form
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const driveInput = document.querySelector("#drive-input");
const submitBtn = document.querySelector(".submit-btn");

const nameDisplay = document.querySelector(".name-display");
const emailDisplay = document.querySelector(".email-display");
const driveDisplay = document.querySelector(".drive-display");

let userObj;


// ADD EVENT LISTENERS ====================================

// click add button to increment by 1
addBtn.onclick = () => {
    count++;
    countDisplay.innerText = count;
};

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



