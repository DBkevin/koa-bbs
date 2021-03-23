module.exports=(user_id) => {
 (ctx, next) => {
        console.log("进入验证");
        if (!ctx.session.user) {
            ctx.session.info = {
                danger: '未登陆，请先登陆!',
            };
            ctx.redirect('/login');
            return;
        } else if (ctx.session.user.id !== user_id) {
            console.log("判错");
            ctx.session.info = {
                danger: '权限不足!',
            };
            ctx.redirect('/');
            return;
        } else {
            console.log("判断对了");
            next();
        }
    }
};


