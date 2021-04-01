const db = require('../core/db');
const xss = require('xss');
exports = module.exports = {
    async destroy(ctx, next) {
    },
    async store(ctx, next) {
        console.log(ctx.request.body);
        const { topic_id, content } = db.escape(ctx.request.body, ['topic_id']);
        let topicSQL = `select * from topics where id=${topic_id} `;
        let topic = await db.query(topicSQL);
        if (topic) {
            let con = xss(content);
            con = db.cape(con);
            let insertSQL = `insert into replies (topic_id,user_id,content) values(${topic_id},${ctx.session.user.id},${con})`;
            console.log(insertSQL);
            let reply = await db.query(insertSQL);
            if (reply) {
                ctx.session.info = {
                    success: '回复成功'
                };
                ctx.redirect('back');
            } else {
                ctx.session.info = {
                    error: '错误，清稍后再试'
                };
                ctx.redirect('back');
            }
        } else {
            ctx.session.info = {
                danger: '话题不存在！'
            };
            ctx.redirect('back');
        }
    }
}