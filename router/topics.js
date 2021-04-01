const db = require('../core/db');
const timeago = require('timeago.js');
const pagination = require('../middleware/pagination');
const authorize = require('../middleware/authorize');
const xss = require('xss');
const update = require('../middleware/update');
exports = module.exports = {
    async index(ctx, next) {
        $topicsViewConfig = {
            title: '话题列表',
            pagename: '../topics/index',
            routerName: 'topics-index',
        }
        //排序参数
        let order = ctx.query.order ? ctx.query.order : 'default';
        let by = order == 'default' ? 'DESC' : 'ASC';
        //分页 参数
        let page = ctx.query.page ? ctx.query.page : 1;
        let limit = 10;
        let offset = (page - 1) * 10;
        //获取总数
        let Count = await db.query(`select count(id)AS count from topics`);
        //计算累计多少页
        let pageCount = Math.ceil(Count[0].count / limit);
        let listSQL = `SELECT u.name AS U_name,u.avatar as U_avatar,u.id AS U_id,c.name AS C_name,c.id AS C_id,t.id AS T_id,t.title AS T_title,t.body AS T_body,t.updated_at,t.reply_count FROM topics t,users u,categories c WHERE t.user_id=u.id AND t.category_id=c.id  ORDER BY t.id ${by}  limit 10 offset ${offset}`;
        let topics = await db.query(listSQL);
        topics.forEach(item => {
            item.updated_at = timeago.format(item.updated_at, 'zh_CN');
        });
        $topicsViewConfig.topics = topics;
        $topicsViewConfig.pagination = pagination(pageCount, 'topics', page);
        await ctx.render('layouts/index', $topicsViewConfig);
    },
    async categoriesShow(ctx, next) {
        const { id } = db.escape(ctx.params, ['id']);
        //排序参数
        let order = ctx.query.order ? ctx.query.order : 'default';
        let by = order == 'default' ? 'DESC' : 'ASC';
        //分页 参数
        let page = ctx.query.page ? ctx.query.page : 1;
        let limit = 10;
        let offset = (page - 1) * 10;
        //获取总数
        let Count = await db.query(`select count(id) AS count from topics where category_id=${id}`);
        //计算累计多少页
        let pageCount = Math.ceil(Count[0].count / limit);
        let categriesSQL = `select * from categories where id=${id}`;
        let categories = await db.query(categriesSQL);
        let listSQL = ` SELECT u.name AS U_name,u.avatar as U_avatar,u.id AS U_id,t.id AS T_id,t.title AS T_title,t.body AS T_body,t.updated_at,t.reply_count FROM topics t,users u WHERE t.user_id=u.id AND t.category_id IN (${categories[0].id})  ORDER BY t.id ${by}  limit ${limit} offset ${offset} `;
        let topics = await db.query(listSQL);
        topics.forEach(item => {
            item.updated_at = timeago.format(item.updated_at, 'zh_CN');
            item.C_id = categories[0].id;
            item.C_name = categories[0].name;
        });
        $topicsViewConfig = {
            title: `${categories[0].name}-话题列表`,
            pagename: '../topics/index',
            routerName: 'categories-show',
        }
        $topicsViewConfig.topics = topics;
        $topicsViewConfig.pagination = pagination(pageCount, `categories/${id}`, page);
        await ctx.render('layouts/index', $topicsViewConfig);
    },
    async create(ctx, next) {
        const topicsViewConfig = {
            title: '发布话题',
            pagename: '../topics/create',
            routerName: 'topics-create',
        };
        if (ctx.method === 'GET') {
            //获取类别
            let categoriesSQL = `SELECT id,name from categories`;
            let categories = await db.query(categoriesSQL);
            topicsViewConfig.categories = categories;
            await ctx.render('layouts/index', topicsViewConfig);
            return;
        }
        let { title, category_id, body } = db.escape(ctx.request.body, ['title', 'category_id', 'body']);
        title = xss(title);
        body = xss(body);
        //TODO 数据校验
        let insertTopics = `insert into topics (title,body,user_id,category_id) values(${title},${body},${ctx.session.user.id},${category_id})`;
        let topic = await db.query(insertTopics);
        if (topic) {
            ctx.session.info = {
                success: '话题发布成功',
            };
            ctx.redirect(`/topics/${topic.insertId}`);
        }
    },
    async uploadImages(ctx, next) {
        // 初始化返回数据，默认是失败的
        const data = {
            'success': false,
            'msg': '上传失败!',
            'file_path': ''
        }
        // 判断是否有上传文件，并赋值给 $file
        if (ctx.req.file.path) {
            let avatarList = ctx.req.file.destination.split('\\');
            data.file_path = "/avatar/" + avatarList[avatarList.length - 1] + '/' + ctx.req.file.filename;
            data.msg = '上传成功';
            data.success = true;
        }

        // 判断是否有上传文件，并赋值给 $filedd
        ctx.status = 200;
        ctx.set("Content-Type", "application/json");
        ctx.body = JSON.stringify(data);
    },
    async show(ctx, next) {
        const { id } = db.escape(ctx.params, ['id']);
        let isIdSQL = `select * from topics where id=${id}`;
        let isId = await db.query(isIdSQL);
        if (isId) {
            const showInfoSQl = `SELECT u.id AS U_id, u.avatar AS U_avatar,u.name AS U_name, t.title AS T_title,t.id AS T_id,t.body as T_body,t.user_id AS T_user_id,c.id AS C_id,c.name AS C_name,t.reply_count AS T_replay_count,t.created_at AS T_created_at FROM users u, topics t,categories c WHERE t.id=${id} AND t.user_id=u.id AND t.category_id=c.id`;
            let showInfo = await db.query(showInfoSQl);
            showInfo[0].T_created_at = timeago.format(showInfo[0].T_created_at, 'zh_CN');
            const topic = showInfo[0];
            const repliesSQL=`SELECT r.* ,u.name AS user_name,u.id AS user_id, u.avatar AS user_avatar FROM replies r,users u WHERE  r.user_id=u.id AND r.topic_id=${id}`
            let replies = await db.query(repliesSQL);
            replies.forEach(item => {
                item.created_at = timeago.format(item.created_at, 'zh_CN');
            });
            let author = update(ctx, topic.T_user_id);
            const topicsViewConfig = {
                title: `${showInfo[0].T_title}`,
                pagename: '../topics/show',
                routerName: 'topics-show',
                topic,
                author,
                replies
            };
            await ctx.render('layouts/index', topicsViewConfig);
        } else {
            ctx.body = '没有该话题';
        }

    },
    async edit(ctx, next) {
        const { id } = db.escape(ctx.params, ['id']);
        let topicSQL = `SELECT u.name AS U_name,u.id AS U_id,u.avatar AS U_avatar, t.* FROM topics t,users u WHERE t.id=${id} AND t.user_id =u.id `;
        let topic = await db.query(topicSQL);
        if (topic) {
            if (!authorize(ctx, topic[0].user_id)) {
                ctx.redirect('back');
                return;
            }
            //获取分类数据
            let categoriesSQL = `SELECT id,name from categories`;
            let categories = await db.query(categoriesSQL);
            const topicsViewConfig = {
                title: `${topic[0].title}`,
                pagename: '../topics/create',
                routerName: 'topics-create',
                topic: topic[0]
            };
            topicsViewConfig.categories = categories;
            await ctx.render('layouts/index', topicsViewConfig);
        } else {
            ctx.body = "没有该话题";
        }
    },
    async update(ctx, next) {
        const { id }  = db.escape(ctx.params, ['id']);
        let topicSQl = `select * from topics where id=${id}`;
        let topic = await db.query(topicSQl);
        if (topic) {
            if (authorize(ctx, topic[0].user_id)) {
               let { title, category_id, body } = db.escape(ctx.request.body, ['title', 'category_id']);
                title = xss(title);
                body = xss(body);
                let UpdateTopicSQL = `update topics set  title=${title},body='${body}',category_id=${category_id} where id=${id}`;
                let uptopic = await db.query(UpdateTopicSQL);
                if (uptopic) {
                    ctx.session.info = {
                        success: '话题更新成功',
                    };
                    ctx.redirect(`/topics/${topic[0].id}`);
                }
            } else {
                ctx.session.info = {
                    danger: '没有权限编辑该文档',
                };
                ctx.redirect('back');
            }

        } else {
            ctx.session.info = {
                danger: '不存在该文档'
            };
            ctx.redirect('back');
        }
    },
    async destory(ctx, next) {
        const { id } = db.escape(ctx.params, ['id']);
        let topicSQl = `select * from topics where id=${id}`;
        let topic= await db.query(topicSQl);
        if (topic) {
            if (authorize(ctx, topic[0].user_id)) {
                let deleteSQL = `delete from topics where id=${id}`;
                let de  = await db.query(deleteSQL);
                if (de) {
                    ctx.session.info = {
                        success: '删除成功',
                    };
                   ctx.redirect('/topics');
                }
            }
        } else {
            ctx.session.info = {
                danger: "文档不存在"
            };
            ctx.redirect('back');
        }
    }

}