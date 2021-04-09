const role = require('../core/roles');
module.exports = () => {
    return async (ctx, next) => {
        if (ctx.session.user) {
            if (role.hasRole("Founder", ctx.session.user.id)) {
                 await next();
            } else {
                ctx.session.info = {
                    danger: '没有后台访问权限'
                };
                await ctx.redirect('/');
            }
        } else {
            ctx.session.info = {
                danger: '未登陆无法操作，请先登陆',
            };
            await ctx.redirect("/login");
        }
    }
}