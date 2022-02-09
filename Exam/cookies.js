class Cookie {
    constructor(){}
    // set cookie
    setCookie(cookieName, cookieValue, expiration_date) {
        document.cookie = cookieName+ "=" + cookieValue + "; expires=" + expiration_date;
    }
    
    // get cookie
    getCookie(cookieName) {
        var result = "not found";
        var data = document.cookie;
        var cookies = data.split(';');
        cookies.forEach(function (el){
            var keyAndValue = el.trim().split("=");
            if(keyAndValue[0] === cookieName){
                result = keyAndValue[1];
            }
        })
        return result;
    }
    
    // delete cookie
    deleteCookie(cookieName) {
        var cookie = getCookie(cookieName);
        if(cookie !== 'not found'){
            setCookie(cookieName, cookie.cookieValue, new Date('1/1/2000'))
        }
    }
    
    // allCookieList
    allCookieList() {
        var cookieList = document.cookie.split(';');
        cookieList.forEach(el => {
            el.trim();
        })
        return cookieList;
    }
    
    // hasCookie
    hasCookie(cookieName) {
        allCookieList().forEach(cookie => {
            var cookie_name = cookie.split('=')[0].trim();
            if(cookie_name === cookieName){
                return true;
            }
            else{
                return false;
            }
        })
    }
}    


// setCookie("name","ahmed",new Date("1/1/2023"));

// console.log(allCookieList())

// console.log(hasCookie('name'))
