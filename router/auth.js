const db = require('../core/db');
const bcrypt = require('bcryptjs');
const mail = require('../core/nodemailer');
const mailHtml = require('../core/mailtoHtml');
const stringRandom = require('string-random');
const mailConfig = require("../config/index");
module.exports = {
    async register(ctx, next) {
        let ejsconfig = {
            title: '注册',
            pagename: '../auth/register',
            routerName: 'register',
        }
        if (ctx.method === 'GET') {
            await ctx.render("layouts/index", ejsconfig);
            return;
        }
        let { name, password, password_confirmation, captcha, email } = ctx.request.body;
        let { text, expiration } = ctx.session.captcha;
        if (password !== password_confirmation) {
            ejsconfig['errors_password'] = "两次密码不一致，请重新输入";
            await ctx.render("layouts/index", ejsconfig);
        } else if (expiration < Date.now()) {
            ejsconfig['errors_captcha'] = "验证码已经过期,请重新输入";
            await ctx.render("layouts/index", ejsconfig);
        } else if (captcha !== text) {
            ejsconfig['errors_captcha'] = "验证码不对，请重新输入";
            await ctx.render("layouts/index", ejsconfig);
        }
        //TODO 传递的参数校验防止注入
        let emailUniqueSQL = `select * from users where email="${email}"`;
        let emailUnique = await db(emailUniqueSQL);
        if (emailUnique) {
            ejsconfig['errors_email'] = "该邮箱已经注册，请登陆或更换邮箱";
            await ctx.render("layouts/index", ejsconfig);
            return;
        }
        let nameSQL = `select * from users where name="${name}"`;
        let user = await db(nameSQL);
        if (!user) {
            // 生成salt
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            // 拼接新增语句
            let userSQL = `insert into users(NAME,PASSWORD,email) values("${name}","${password}","${email})`;
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

    },
    async login(ctx, next) {
        let ejsconfig = {
            title: '登陆',
            pagename: '../auth/login',
            routerName: 'login',
        }
        if (ctx.method === 'GET') {
            await ctx.render("layouts/index", ejsconfig);
            return;
        }
        let { name, password } = ctx.request.body;
        //TODO 传递的参数校验防止注入
        //先查找有无盖用户
        let nameSQL = `select * from users where name="${name}"`;
        let user = await db(nameSQL);
        if (!user) {
            ejsconfig['errors_name'] = "用户不存在，请核对或注册";
            await ctx.render("layouts/index", ejsconfig);
            return;
        } else {
            let comparsePwd = await bcrypt.compare(password, user[0].password);
            if (comparsePwd) {
                //密码正确允许登陆，设置session
                ctx.session.user = {
                    id: user[0].id,
                    name: name,
                    avatar:user[0].avatar,
                };
                await ctx.redirect('/');
            } else {
                ejsconfig['errors_password'] = "密码不匹配";
                await ctx.render("layouts/index", ejsconfig);
            }
        }
    },
    async logout(ctx, next) {
        ctx.session.user = null;
        await ctx.redirect('/');
    },
    async email(ctx, next) {
        let ejsconfig = {
            title: '重置密码',
            pagename: '../auth/email',
            routerName: 'reset',
        }
        if (ctx.method === 'GET') {
            await ctx.render("layouts/index", ejsconfig);
            return;
        }
        //TODO参数校验，防止注入
        const { email } = ctx.request.body;
        let emailUniqueSQL = `select * from users where email="${email}"`;
        let emailUnique = await db(emailUniqueSQL);
        if (emailUnique) {
            //生成随机字符串
            let code = stringRandom(60);
            let expiration = Date.now() + 600000;
            //插入数据库并添加上时间
            let upCodeSQL = `update users set remember_token="${code}",remember_token_expiration=${expiration} where id=${emailUnique[0].id}`;
            const upCode = await db(upCodeSQL);
            if (upCode) {
                let url = `password/reset/${code}`;
                let html = new mailHtml('auth/repass.ejs', url);
                let mailOptions = {
                    from: mailConfig.mailConfig.auth.user, //发送者邮件地址(发件人地址)
                    to: emailUnique[0].email, //收件人地址
                    subject: '重置密码重置',//邮件标题
                    html: html.buildHtml(),//邮件内容
                };
                let testmail = new mail(mailOptions);
                if (!testmail) {
                    ctx.body = "系统错误，请稍后再试或联系管理员";
                }
                ejsconfig['success'] = "邮件发送成功，请在10分钟内处理";
                await ctx.render('layouts/index', ejsconfig);
            } else {
                ctx.body = "系统错误，请稍后再试";
            }
        } else {
            ejsconfig['errors_email'] = "该邮箱不存在，请确认";
            ejsconfig['email'] = email;
            await ctx.render("layouts/index", ejsconfig);
            return;
        }
    },
    async reset(ctx, next) {
        let ejsconfig = {
            title: '重置密码',
            pagename: '../auth/reset',
            routerName: 'reset',
        }
        if (ctx.method === 'GET') {
            let {member_token} = ctx.params;
            let queryTokenSQL = `select * from users where remember_token="${member_token}"`;
            let queryToken = await db(queryTokenSQL);
            if (queryToken && queryToken[0].remember_token_expiration >= Date.now()) {
                ejsconfig['member_token'] = member_token;
                await ctx.render("layouts/index", ejsconfig);
            } else {
                ejsconfig['pagename'] = '../auth/email';
                ejsconfig['danger']='重置密码错误，请重新提交请求';
                await ctx.render('layouts/index', ejsconfig);
            }
            return;
        }
        let { name, password, password_confirmation,member_token} = ctx.request.body;
        if (password !== password_confirmation) {
            ejsconfig['errors_password'] = "两次密码不一致，请重新输入";
            await ctx.render("layouts/index", ejsconfig);
        }
        let userSQL = `select * from users where name="${name}"`;
        let user = await db(userSQL);
        if (user && user[0].remember_token === member_token && user[0].remember_token_expiration >= Date.now()) {
           // 生成salt
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            let upPassSQL = `update users SET password="${password}",remember_token=NULL,remember_token_expiration=NULL where id=${user[0].id}`;
            let upPass = await db(upPassSQL);
            if (upPass) {
                ejsconfig['success'] = '密码重置成功！';
                ejsconfig['pagename'] = '../auth/login';
                await ctx.render('layouts/index', ejsconfig);
            }
        } else {
            ejsconfig['danger'] = '信息核验失败！';
            await ctx.render('layouts/index', ejsconfig);
        }
    }
}