
//获取当前url
$().ready(function () {
    let urlSearch = window.location.search;
    let orderUrlRencent = '';
    let orderUrlDefault = '';
    if (urlSearch) {
        if (urlSearch.indexOf('order') === -1) {
             orderUrlRencent = window.location.pathname+urlSearch + '&order=recent';
            orderUrlDefault = window.location.pathname + urlSearch + '&order=default';
        } else {
            if (urlSearch.indexOf('order=recent')!==-1) {
                $('.rencent').addClass('active');
                $('.default').removeClass('active');
                orderUrlRencent = window.location.pathname + urlSearch;
                orderUrlDefault = window.location.pathname + urlSearch.replace("recent","default");
            } else {

                orderUrlRencent = window.location.pathname + (urlSearch.replace('default', 'recent'));
                orderUrlDefault = window.location.pathname + urlSearch;
            }
        }
    } else {
         orderUrlRencent = window.location.pathname+  '?order=recent';
        orderUrlDefault = window.location.pathname + '?order=default';
    }
    $('.default').attr('href',orderUrlDefault);
    $('.rencent').attr('href', orderUrlRencent);
});