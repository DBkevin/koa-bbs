#案例分析
该项目是采用koa框架的一个bss。主要点有3个 

1 角色 

2 信息 

3 动作
## 1.角色
在该系统中，角色一共有以下几种
.游客---没有登陆的用户

- 用户---注册用户，没有多余权限

- 管理员---辅助管理员做社区内容管理

- 站长---权限最高的用户

角色的权限从低到高，高权限的用户将包含权限低的用户权限。

## 2.信息结构
主要信息有：
- 用户 —— 模型名称 User，论坛为 UGC 产品，所有内容都围绕用户来进行；

- 话题 —— 模型名称 Topic，LaraBBS 论坛应用的最核心数据，有时我们称为帖子；

- 分类 —— 模型名称 Category，话题的分类，每一个话题必须对应一个分类，分类由管理员创建；

- 回复 —— 模型名称 Reply，针对某个话题的讨论，一个话题下可以有多个回复。

## 3.动作
角色和信息之间的互动称之为『动作』，动作主要由以下几个：

- 创建 Create

- 查看 Read

- 编辑 Update

- 删除 Delete

## 权限
排序后的高权限角色适用前面角色的用例
### 1.游客
- 游客可以查看所有话题列表；

- 游客可以查看某个分类下的所有话题列表；

- 游客可以按照发布时间和最后回复时间进行话题列表排序；

- 游客可以查看单个话题内容；

- 游客可以查看话题的所有回复；

- 游客可以通过注册按钮创建用户（用户注册，游客专属）；

- 游客可以查看用户的个人页面。
### 2. 用户
- 用户可以在某个分类下发布话题；

- 用户可以编辑自己发布的话题；

- 用户可以删除自己发布的话题； 

- 用户可以回复所有话题；

- 用户可以删除自己的回复；

- 用户可以编辑自己的个人资料；

- 用户可以接收话题新回复的通知
### 3.管理员
- 管理员可以访问后台；

- 管理员可以编辑所有的话题；

- 管理员可以删除所有的回复；

- 管理员可以编辑分类。
### 4. 站长
- 站长可以编辑用户；

- 站长可以删除用户；

- 站长可以修改站点设置；

- 站长可以删除分类。

### 目录说明
* `doc` 用于存放说明文档

* `core` 用于存放各种核心文件，如mysql
* `public` 对外公开的静态文件，如css,js
* `views` 模板文件
* `router` 路由文件
* `config` 各种配置文件，如数据库帐号密码

### 使用到的组件

* `koa`
* `ejs`
* `koa-bodyparser`
* `koa-router`
* `koa-views`
* `koa-session`
* `koa-static`
* `mysql`

``` bash
yarn add koa koa-bodyparser koa-router koa-views koa-session  koa-static ejs mysql
```
### 引入各组件
编辑`app.js`

```js
const koa = require('koa');
const app = new koa();
const bodyparser = require('koa-bodyparser');
const session = require('koa-session');
const path = require('path');
const Router = require('./router/index');
const static = require('koa-static');
const views = require('koa-views');
//设置session的key
app.use(session({
    key: 'koa-bbs',
    maxAge: 86400000,
},app));
//注入post数据
app.use(bodyparser());
//设置静态目录
app.use(static(path.join(__dirname), './public'));
//设置模板目录并指定模板引擎
app.use(views(path.join(__dirname), './views'), {
    extends: 'ejs'
});
//设置路由
Router(app);

app.listen(3000, () => {
    console.log('开启OK');
})
```
在`router`下新建一个`index.js`用住全部路由控制。
```js
const router = require('koa-router')();
module.exports = (app) => {
    router.get('/', async (ctx, next) => {
         ctx.body="首页";
    });
    router.get("/about", async (ctx, next) => {
        ctx.body = "关于";
    });
    router.get("/help", async (ctx, next) => {
        ctx.body="帮助";
    });
    //吧路由注入到app里面
    app.use(router.routes());
    //吧所有方法都注入到app里面
    app.use(router.allowedMethods());
}
```