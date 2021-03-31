const faker = require('faker/locale/zh_CN');
const db = require('../core/db');
class topics {
    UserList = null;
    topicsCount = 100;
    list = [];
    insertSQL = "insert into topics (title,body,user_id,crtegory_id) values";
    getUserSQL = `select id from users`;
    tmp = [];
    getUser() {
        db.query(this.getUserSQL).then(data => {
            this.UserList = data.map(obj => {
                return obj.id;
            })
            this.setTopics();
        });
    }
    setTopics() {
        //生成100条
        for (let index = 0; index < this.topicsCount; index++) {
            let tmp = [];
            tmp.title = faker.lorem.sentence();
            tmp.body = faker.lorem.text();
            tmp.user_id = this.UserList[faker.random.number(11)];
            tmp.category_id = faker.random.number({ min: 1, max: 4 });
            this.list.push(tmp);
            tmp = null;
        }
        this.setInserSQL()
    }
    setInserSQL() {
        for (let index = 0; index < this.topicsCount; index++) {
            if (index != this.topicsCount-1) {
                let a = `("${this.list[index].title}","${this.list[index].body}","${this.list[index].user_id}","${this.list[index].category_id}"),`;
                this.tmp.push(a);
                a = null;
            } else {
                let a = `("${this.list[index].title}","${this.list[index].body}","${this.list[index].user_id}","${this.list[index].category_id}");`;
               this.tmp.push(a);
                a = null;
            }

        }
        this.insertSQL += this.tmp.join("");
        this.insert();
    }
    insert() {
        db.query(this.insertSQL).then(data => {
            console.log(`成功插入${this.topicsCount}条`);
        }).catch(err => {
            console.log(err);
        })
    }
}
let a = new topics();
a.getUser();

