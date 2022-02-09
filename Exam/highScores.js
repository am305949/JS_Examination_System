var highScoresList = document.querySelector('#highScoresList');

var usersCookies = getCookies();
var useremail = usersCookies['user'];
var userCookie = JSON.parse(getCookies()[`${useremail}`]);

var userName = `${userCookie['firstname']} ${userCookie['lastname']}`;
var highScores = JSON.parse(userCookie['highScores']);

highScores.forEach((score) => {
    highScoresList.innerHTML += `<li class="high-score">
                                    ${userName} - ${score}
                                </li>`;
})
// highScoresList.innerHTML = highScores.map(score => {
//     return `<li class="high-score">
//                 ${userName} - ${highScores[score]}
//             </li>`
// }).join(''); 

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