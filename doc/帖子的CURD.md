## 帖子的CURD

现在个人页表页面还是空的，我们要在个人信息页面上显示出来这个人发过的帖子以及回复的内容，
先修改个人页面的模板，把暂无内容替换为【ta的话题】和【ta的回复】两个入口：
 具体视图代码查看 *`views/users/show.ejs`*
 然后再`router/user.js`中的`show`方法中添加分页，查询用户发的帖子，并传递给视图模板：
 ```js
 .
 .
async show(ctx, next) {
	let { user } = ctx.params;
	let queryUserSQL = `select * from users where id=${user}`;
	let queryUser = await db(queryUserSQL);
	if (queryUser) {
	//分页 参数
	let page = ctx.query.page ? ctx.query.page : 1;
	let limit = 5;
	let offset = (page - 1) * limit;
	//获取总数
	let Count = await db(`select count(id)AS count from topics where user_id=${user}`);
	//计算累计多少页
	let pageCount = Math.ceil(Count[0].count / limit);
	let listSQL = ` SELECT c.name AS C_name,c.id AS C_id,t.id AS T_id,t.title AS T_title,t.body AS T_body,t.updated_at,t.reply_count FROM topics t,categories c WHERE  t.category_id=c.id AND t.user_id IN (${user})  limit ${limit} offset ${offset} `;
	let topics = await db(listSQL);
	topics.forEach(item=> {
		item.updated_at = timeago.format(item.updated_at, 'zh_CN');
	});
	pageList=pagination(pageCount,`users/${user}`, page),
	queryUser[0].created_at = timeago.format(queryUser[0].created_at, 'zh_CN');
		await ctx.render("layouts/index", {
			title: queryUser[0].name + '的个人中心',
			pagename: '../users/show',
			routerName: 'show',
			user: queryUser[0],
			topics: topics,
			pagination: pageList,
		});
	} else {
		ctx.body = "用户不存在！";
	}
},
.
 ```
*记得把`midleware/pagination.js`引入进来*
好了，现在个人页面也能看到个人发的所有帖子了，如图1：

分页也可以正常工作，如图2：


### 新建发布帖子

