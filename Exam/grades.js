var gradesScore = document.querySelector('#gradesScore');
var gradesText = document.querySelector('#grades-text')

var usersCookies = getCookies();
var useremail = usersCookies['user'];
var userCookie = JSON.parse(getCookies()[`${useremail}`]);

var totalScore = userCookie['totalScore'];
var userScore = userCookie['mostRecentScore'];
var userName = `${userCookie['firstname']} ${userCookie['lastname']}`;

gradesScore.innerText += `${userScore} / ${totalScore}`;

gradesText.innerText = `Great job, ${userName}`;


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
