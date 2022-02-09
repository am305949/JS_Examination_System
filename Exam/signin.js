var passwordRegEx = /^(?=.{8,})/;
var nameRegEx = /^[a-zA-Z ]+$/;
var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var email = document.querySelector("#email");
var password = document.querySelector("#password");

var email_span = document.querySelector("#email_span");
var password_span = document.querySelector("#password_span");

var signinBtn = document.querySelector('#signBtn');
var examIntro = document.querySelector('.exam-intro');

email.addEventListener('keyup', () => {
    signinBtn.disabled = !(email.value);
    // signupBtn.disabled = !(firstname.value && lastname.value && email.value && password.value && repassword.value);
})
var testObj = {email:'email'};
// var usersCookies = getCookies();
// var useremail = hasCookie('user') ? getCookies()['user'] : 'email';
// var userCookie = (useremail === 'email') ? {email:'email'} : JSON.parse(getCookies()[`${useremail}`]);
var flag = 1;

function signin(e) {
    e.preventDefault();

    email_span.textContent = "";
    password_span.textContent = "";
    flag = 1;

    var email_value = email.value;
    var password_value = password.value;

    var useremail = hasCookie(`${email_value}`) ? getCookies()[`${email_value}`] : 'email';
    var userCookie = (useremail === 'email') ? {email:'email'} : JSON.parse(`${useremail}`);

    if(email_value==""){
        email_span.textContent = "this field is required";
        email.style.borderColor = "red";
        flag = 0;
    }
    else if(email_value !== userCookie['email']){
        email_span.textContent = "this email doesn't exist";
        email.style.borderColor = "red";
        flag = 0;
    }
    else{
        email.style.borderColor = "green";
    }

    if(password_value==""){
        password_span.textContent = "this field is required";
        password.style.borderColor = "red";
        flag = 0;
    }
    else if(password_value !== userCookie['password'] || userCookie === {}){
        password_span.textContent = "wrong password";
        password.style.borderColor = "red";
        flag = 0;
    }
    else{
        password.style.borderColor = "green";
    }
    
    if(flag){
        var cookieDate = new Date("1/1/2023");
        setCookie(`user`, `${email_value}`, cookieDate); // set cookie to get user email
        var sec = 1;
        examIntro.style.display = 'block';
        interval = setInterval(() => {
            examIntro.innerHTML = `Exam will start in ${sec} seconds, be ready...`;
            sec++;
            if (sec === 11) {
                clearInterval(interval);
            }
        }, 1000);

        setTimeout(() => {
            window.location.replace('exam.html');
        }, 10000);
    }

}

// set cookie
function setCookie(cookieName, cookieValue, expiration_date) {
    document.cookie = `${cookieName} = ${cookieValue}; expires = ${expiration_date}`;
}

// get cookie
function getCookies() {
    var key = "user";
    var value = "not found";
    var result = {};
    var data = document.cookie;
    var cookies = data.split(';');
    cookies.forEach(function (el){
        var keyAndValue = el.trim().split("=");
        key = keyAndValue[0];
        value = keyAndValue[1];
        result[`${key}`] = value;
    })
    return result;
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
    var flag = false;
    allCookieList().forEach(cookie => {
        var cookie_name = cookie.split('=')[0].trim();
        if(cookie_name === cookieName){
            flag = true;
        }
    })
    return flag;
}
