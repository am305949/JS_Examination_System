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
})

localStorage.setItem('instructor_email', 'admin@admin');
localStorage.setItem('instructor_password', 'admin');

var flag = 1;

function signin(e) {
    e.preventDefault();

    email_span.textContent = "";
    password_span.textContent = "";
    flag = 1;

    var email_value = email.value;
    var password_value = password.value;

    if(email_value==""){
        email_span.textContent = "this field is required";
        email.style.borderColor = "red";
        flag = 0;
    }
    else if(email_value !== localStorage.getItem('instructor_email')){
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
    else if(password_value !== localStorage.getItem('instructor_password')){
        password_span.textContent = "wrong password";
        password.style.borderColor = "red";
        flag = 0;
    }
    else{
        password.style.borderColor = "green";
    }
    
    if(flag){
        examIntro.style.display = 'block';
        examIntro.innerHTML = `Welcome back ....`;

        setTimeout(() => {
            window.location.replace('settings.html');
        }, 2000);
    }

}

