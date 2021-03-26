$(document).ready(function () {
    let urlPathname = window.location.pathname;
    if (urlPathname.indexOf("categories")!==-1) {
        let urlList = urlPathname.split('/');
        let activeId = urlList[2];
        $('.navbar-nav li').eq(activeId).addClass('active').siblings().removeClass('active');
    } 
});