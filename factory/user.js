const faker = require('faker/locale/zh_CN');
const db = require('../core/db');
const avatarList = [
    '2021324/1.png',
    '2021324/2.png',
    '2021324/3.png',
    '2021324/4.png',
    '2021324/5.png',
    '2021324/6.png',
];

const list = [];
for (let index1 = 0; index1 < 10; index1++) {
    let tmp = [];
    tmp.name = faker.name.lastName() + faker.name.firstName();
    tmp.email = faker.internet.email();
    tmp.password = '$2a$10$bOX3tXhHOZmarRZYspEfc.7/ErwwlnT1AK1pTZiHCXicgf9KUGUny';
    tmp.introduction = faker.lorem.sentence();
    tmp.avatar = avatarList[parseInt(Math.random(1, 6)*10 - 1)];
    list.push(tmp);
    tmp = null;
}
const insertSQL = "insert into users(NAME,email,password,introduction,avatar) values";
const tmp = [];
for (let index = 0; index < 10; index++) {
    if (index != 9) {
        let a = `("${list[index]['name']}","${list[index].email}","${list[index].password}","${list[index].introduction}","${list[index].avatar}"),`;
        tmp.push(a);
        a = null;
    } else {
        let a = `("${list[index]['name']}","${list[index].email}","${list[index].password}","${list[index].introduction}","${list[index].avatar}");`;
        tmp.push(a);
        a = null;
    }
       
}
let tmp1 = tmp.join("");
console.log(insertSQL + tmp1);