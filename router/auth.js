const db = require('../core/db');
const bcrypt = require('bcryptjs');
module.exports = {
    async register(ctx, next) {
         let ejsconfig = {
            title: '首页',
            pagename: '../auth/register',
            routerName: 'register',
        }
        if (ctx.method === 'GET') {
            await ctx.render("layouts/index", ejsconfig);
            return;
        }
        let { name, password, password_confirmation, captcha } = ctx.request.body;
        let { text, expiration } = ctx.session.captcha;
        if (password !== password_confirmation) {
            ejsconfig['errors_password'] = "两次密码不一致，请重新输入";
            await ctx.render("layouts/index", ejsconfig);
        } else if (expiration<Date.now()) {
            ejsconfig['errors_captcha'] = "验证码已经过期,请重新输入";
            await ctx.render("layouts/index", ejsconfig);
        } else if (captcha !== text) {
            ejsconfig['errors_captcha'] = "验证码不对，请重新输入";
            await ctx.render("layouts/index", ejsconfig);
        }
        //TODO 传递的参数校验防止注入
        let nameSQL = `select * from users where name="${name}"`;
        let user = await db(nameSQL);
        if (!user) {
            // 生成salt
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            // 拼接新增语句
            let userSQL = `insert into users(NAME,PASSWORD) values("${name}","${password}")`;
            console.log(userSQL);
            //存储到数据库
            await db(userSQL).then((result) => {
                ctx.session.user = {
                    id: result.insertId,
                    name: name,
                };
                ctx.redirect('/');
            }).catch((err) => {
                console.log(err);
            });
        } else {
            ejsconfig['errors_name'] = "用户已经存在，";
            await ctx.render("layouts/index", ejsconfig);
        }

    }
}