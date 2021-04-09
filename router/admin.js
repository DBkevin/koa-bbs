const db = require("../core/db");

exports=module.exports = {
    async index(ctx, next) {
        let ejsconfig = {
            title: '首页',
            pagename: '../index',
            routerName: 'admin-index',
        }
        let categoriesSQL = `select id,name,description from categories `;
        let categories = await db.query(categoriesSQL);
        ejsconfig.categories = categories;
        await ctx.render("admin/layouts/index", ejsconfig);
    }
}