exports = module.exports = (count,url,page) => {
    const pagination = [];
    for (let index = 1; index <= count; index++) {
        if (page == index) {
            pagination.push(`<li class="active page-item"><a href="/${url}?page=${index}" class="page-link">${index}</a></li>`);
        } else {
            pagination.push(`<li class="page-item"><a href="/${url}?page=${index}" class="page-link">${index}</a></li>`);
        }
    }
    return pagination;
}