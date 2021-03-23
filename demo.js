const fs = require('fs');
const imageSize = require('image-size');
let path = 'D:\\nodeCase\\koa-bbs\\public\\avatar\\2021323\\avatar-1785e0340f8.jpg';
let dimensions=imageSize(path);
console.log(dimensions.width, dimensions.height);
