const router = require(".")

module.exports = {
    async register(ctx, next) {
        await ctx.render("layouts/index", {
            title: '首页',
            pagename: '../auth/register'
        });
    }
}