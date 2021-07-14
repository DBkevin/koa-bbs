# 项目简介
一个koa vue的前后端分离项目
## 数据库
使用Sequelize做ORM层,使用Sequelize-cli来做数据库初始化.
### 数据初始化
- 首先安装 sequelize mysql2 sequelize-cli
```bash
yarn add mysql2 sequelize sequelize-cli
```
- 在根目录下创建一个文件`.sequelizerc`,这是使用`sequelize-cli`工具的时候读取的配置文件.
```js
const path = require('path');
module.exports = {
	'env': 'development',
	'config': path.resolve(__dirname, '/config/databases.json'),
	'seeders-path': path.resolve(__dirname, '/DB/seeders'),
	'migrations-path': path.resolve(__dirname, '/DB/migrations'),
	'model-path': path.resolve(__dirname,'/Models'),
	'debug':true,
}
```
以上配置用于设置环境变量(env),数据库配置文件(config),数据库模型文件(models-path),数据种子脚本文件(seeders-path),数据库迁移脚本文件(migrations-paht)和是否开始debug模式(debug);
- 根据以上配置,创建`/DB/` 以及`/DB/seeders` 等文件夹,并在`/config/`下新建一个`databases.json`

```json
{
    "development":{
        //数据库服务器主机
        "host": "127.0.0.1",
        //数据库类型
        "dialect": "mysql",
        //数据库服务器连接用户名
        "username": "root",
        //数据库服务器连接密码
        "password": "",
        //数据库名称
        "database": ""
    },
    "test":{
        // ...
    },
    "production":{
        // ...
    }
}
```
配置文件中默认会有三个不同环境的配置：`development` 、 `test` 、 `production` ，分别对应： 开发环境 、 测试环境 、 生产环境 （我们也可以根据具体情况增减），它会根据 `.sequelizerc` 中的 env 的值读取不同环境下的配置
- 为了方便执行命令,我们在`package.json`中的`script`对象中新建几个快捷命令:
```json
  	"migrate": "sequelize db:migrate",
    "migrate-down": "sequelize db:migrate:undo",
    "migrate-down-all": "sequelize db:migrate:undo:all",
    "db-create": "sequelize migration:create --name"
```
- 执行 `npm run db-create users` 来新建`Users`的`migrate`文件.该命名会在你的`.sequelizerc`文件中设置的`migrations-path`文件夹下面新建一个当前时间+users的文件，编辑该文件既可以
- 执行 `npm run migrate` 执行并新建表到数据库。
### Models使用
- 创建`users`的Model,在`Models`文件下新建`Users.js`
- 编辑`Models/Users.js`
### Service
...
### Controller
...

# 安装路由 



