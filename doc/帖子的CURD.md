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
接下来，我们开发帖子的发布功能，运行注册用户发布帖子，发布完成后跳转帖子详情页面。
### 新增入口
在我们需要在右边导航栏和顶部导航栏新增发帖入口:
*`views/layouts/_header.ejs`和`views/topics/_sidebar.ejs`*
看看效果，如图3：

接着注册一条路由`topics/create`来显示发帖界面。并新建一个发帖模板`views/topics/create.ejs`,由于发帖功能需要登陆后才可以使用，所以引入`auth`中间件：
```js
    router.get('/topics/create',auth(), require('./topics').create);
```
然后再`router/topics.js`新建一个`create`方法：
```js
async create(ctx,next) {
	const topicsViewConfig = {
		title: '发布话题',
		pagename: '../topics/create',
		routerName: 'topics-create',
	};
	//获取类别
	let categoriesSQL = `SELECT id,name from categories`;
	let categories = await db(categoriesSQL);
	topicsViewConfig.categories = categories;
	await ctx.render('layouts/index', topicsViewConfig);
}
```
接着新建一个视图模板`views/topcis/create.ejs` 具体代码看源文件，这不再继续展示。
打开浏览器，看一下效果如图4：

退出登陆，再次点击新建话题，如图5：
确定未登陆无法进入此页面。

### 接收新建话题的数据

提交新建话题，我们需要有一个方法接收提交的话题，`router/index.js`中添加一条路由来接收该数据，并转给`router/topics.js`中的`create`方法来处理后续数据.
```js
   router.post('/topics/create',auth(), require('./topics').create);
```
*`router/topics.js`*
```js
.
.
 async create(ctx,next) {
        const topicsViewConfig = {
            title: '发布话题',
            pagename: '../topics/create',
            routerName: 'topics-create',
        };
        if (ctx.method === "GET") {
            //获取类别
            let categoriesSQL = `SELECT id,name from categories`;
            let categories = await db(categoriesSQL);
            topicsViewConfig.categories = categories;
            await ctx.render('layouts/index', topicsViewConfig);
            return;
        }
        const { title, category_id, body } = ctx.request.body;
        //TODO 数据校验
        let insertTopics = `insert into topics (title,body,user_id,category_id) values("${title}","${body}",${ctx.session.user.id},${category_id})`;
        let topic = await db(insertTopics);
        if (topic) {
            ctx.session.info = {
                    success: '话题发布成功',
            };
            ctx.redirect('back');
        }
    }
```
发布一条话题试试，如图6：
好了，话题正常发布了，也可以显示在列表中了。
接下来显示话题详情
### 话题详情