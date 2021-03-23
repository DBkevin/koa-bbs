const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');
const dayDirectory = path.join(__dirname, '../public/avatar/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate());
fs.readdir(dayDirectory,  (err, data) => {
    if (err) {
        fs.mkdirSync(dayDirectory);
    } 
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/avatar/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate()))
    },
    filename: function (req, file, cb) {
        let type = file.originalname.split('.')[1]
        cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`)
    }
});
const limits = {
    fields: 10,//非文件字段的数量
    fileSize: 500 * 1024,//文件大小 单位 b
    files: 1//文件数量
}
const upload = multer({storage,limits});
module.exports = upload;
