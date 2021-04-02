const db = require('../core/db');
const xss = require('xss');
const isAuth = require('../middleware/isAuth');
exports = module.exports = {
    async destroy(ctx, next) {
        let { id } = db.escape(ctx.params,['id']);
        let replySQL= `SELECT r.*, t.user_id AS T_user_id FROM replies r,topics t WHERE r.id =${id} AND r.topic_id=t.id`;
        let reply = await db.query(replySQL);
        if (reply) {
            if (isAuth(ctx, reply[0].user_id, reply[0].T_user_id)) {
                let deleSQL = `delete from replies where id=${id}`;
                console.log(deleSQL);
                let de = await db.query(deleSQL);
                if (de) {
                    ctx.session.info = {
                        success: '删除成功'
                    };
                    ctx.redirect('back');
                }
            } 
        }
    },
    async store(ctx, next) {
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