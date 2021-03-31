const faker = require('faker/locale/zh_CN');
const db = require('../core/db');
class reply{
    UserList = null;
    topicsCount = 900;
    list = [];
    insertSQL = "insert into replies (topic_id,user_id,content) values";
    getUserSQL = `select id from users`;
    getTopicsSQL = `select id from topics`;
    topicList = [];
    topics = null;
    tmp = [];
    getUser() {
        db.query(this.getUserSQL).then(data => {
            this.UserList = data.map(obj => {
                return obj.id;
            });
            db.query(this.getTopicsSQL).then(data => {
                this.topics = data.map(obj => {
                    return obj.id;
                });
                this.setReplies();
            })
        });
    }
    setReplies() {
        //生成1000条
        for (let index = 0; index < this.topicsCount; index++) {
            let tmp = [];
            tmp.content = faker.lorem.sentence();
            tmp.topic_id = this.topics[faker.random.number({ min: 5, max: 108 })];
            tmp.user_id= this.UserList[faker.random.number(11)];
            this.list.push(tmp);
            tmp = null;
        }
        this.setInserSQL()
    }
    setInserSQL() {
        for (let index = 0; index < this.topicsCount; index++) {
            if (!this.list[index].topic_id) {
                this.list[index].topic_id = 108;
            }
            if (index != this.topicsCount - 1) {
                let a=`(${this.list[index].topic_id},${this.list[index].user_id},"${this.list[index].content}"),`
                this.tmp.push(a);
                a = null;
            } else {
                let a=`(${this.list[index].topic_id},${this.list[index].user_id},"${this.list[index].content}");`
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
let a = new reply();
a.getUser();
