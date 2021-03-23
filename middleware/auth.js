module.exports = (app) => {
    return async (ctx, next) => {
        if (ctx.session.user) {
            await next();
        } else {
            ctx.session.info = {
                danger: '未登陆无法操作，请先登陆',
            };
            await ctx.redirect("/login");

        }
    }
}