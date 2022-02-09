// import Cookie from "./cookies.js";

var userData = {};
// var userCookie = new Cookie();


var passwordRegEx = /^(?=.{8,})/;
var nameRegEx = /^[a-zA-Z ]{3,}$/;
var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var firstname = document.querySelector("#firstname");
var lastname = document.querySelector("#lastname");
var email = document.querySelector("#email");
var password = document.querySelector("#password");
var repassword = document.querySelector("#repassword");

var firstname_span = document.querySelector("#firstname_span");
var lastname_span = document.querySelector("#lastname_span");
var email_span = document.querySelector("#email_span");
var password_span = document.querySelector("#password_span");
var repassword_span = document.querySelector("#repassword_span");

var signupBtn = document.querySelector('#signBtn');

firstname.addEventListener('keyup', () => {
    signupBtn.disabled = !(firstname.value);
    // signupBtn.disabled = !(firstname.value && lastname.value && email.value && password.value && repassword.value);
})

var flag = 1;

function validate(e) {
    firstname_span.textContent = "";
    lastname_span.textContent = "";
    email_span.textContent = "";
    password_span.textContent = "";
    repassword_span.textContent = "";
    flag = 1;

    var firstname_value = firstname.value;
    var lastname_value = lastname.value;
    var email_value = email.value;
    var password_value = password.value;
    var repassword_value = repassword.value;

    if(firstname_value==""){
        firstname_span.textContent = "this field is required";
        firstname.style.borderColor = "red";
        flag = 0;
    }
    else if(!(nameRegEx.test(firstname_value))){
        firstname_span.textContent = "please enter a valid name";
        firstname.style.borderColor = "red";
        flag = 0;
    }
    else{
        firstname.style.borderColor = "green";
        userData['firstname'] = firstname_value;
    }

    if(lastname_value==""){
        lastname_span.textContent = "this field is required";
        lastname.style.borderColor = "red";
        flag = 0;
    }
    else if(!(nameRegEx.test(lastname_value))){
        lastname_span.textContent = "please enter a valid name";
        lastname.style.borderColor = "red";
        flag = 0;
    }
    else{
        lastname.style.borderColor = "green";
        userData['lastname'] = lastname_value;
    }

    if(email_value==""){
        email_span.textContent = "this field is required";
        email.style.borderColor = "red";
        flag = 0;
    }
    else if(!(emailRegEx.test(email_value))){
        email_span.textContent = "please enter a valid Email";
        email.style.borderColor = "red";
        flag = 0;
    }
    else if(hasCookie(email_value)){
        email_span.textContent = "this email already exists";
        email.style.borderColor = "red";
        flag = 0;
    }
    else{
        email.style.borderColor = "green";
        userData['email'] = email_value;
    }

    if(password_value==""){
        password_span.textContent = "this field is required";
        password.style.borderColor = "red";
        flag = 0;
    }
    else if(!(passwordRegEx.test(password_value))){
        password_span.textContent = "password should be more than or equal 8 characters";
        password.style.borderColor = "red";
        flag = 0;
    }
    else{
        password.style.borderColor = "green";
        userData['password'] = password_value;
    }

    if(repassword_value==""){
        repassword_span.textContent = "this field is required";
        repassword.style.borderColor = "red";
        flag = 0;
    }
    else if(repassword_value !== password_value){
        repassword_span.textContent = "passwords doesn't match";
        repassword.style.borderColor = "red";
        flag = 0;
    }
    else{
        repassword.style.borderColor = "green";
    }
    
    if(flag){
        userData['mostRecentScore'] = 0;
        userData['totalScore'] = 0;
        userData['highScores'] = [0];
        // add cookies
        var cookieDate = new Date("1/1/2023");
        setCookie(`${email_value}`, `${JSON.stringify(userData)}`, cookieDate);
        // setCookie(`user`, `${email_value}`, cookieDate); // set cookie to get user email
        
        setTimeout(() => {
            window.location.replace('signin.html');
        }, 2000);
    }
}

function signup(e) {
    e.preventDefault();

    validate(e);

}

// set cookie
function setCookie(cookieName, cookieValue, expiration_date) {
    document.cookie = `${cookieName} = ${cookieValue}; expires = ${expiration_date}`;
}

// allCookieList
function allCookieList() {
    var cookieList = document.cookie.split(';');
    cookieList.forEach(el => {
        el.trim();
    })
    return cookieList;
}
// hasCookie
function hasCookie(cookieName) {
    var flag;
    allCookieList().forEach(cookie => {
        var cookie_name = cookie.split('=')[0].trim();
        if(cookie_name === cookieName){
            flag = true;
        }
        else{
            flag = false;
        }
    })
    return flag;
}