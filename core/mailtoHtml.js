const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
class mailTohtml{
    templatePath = null;
    url = null;
    constructor(templatePath,url) {
        this.templatePath = `../views/${templatePath}`;
        console.log(this.templatePath);
        this.url = url;
    }
    buildHtml() {
        const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, this.templatePath), "utf-8"));
        let html = template({
                title: 'koa-bbs',
                url: `http://localhost:3000/${this.url}`,
                copyright: new Date().getFullYear(),
        });
        return html;
    }
}
exports = module.exports = mailTohtml;