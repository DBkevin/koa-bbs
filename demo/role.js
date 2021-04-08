const roles = require('../core/roles');
//先创建一个新权限 Demo
//在创建一个角色 Tester
//然后把demo权限赋予给Tester角色，
//然后给用户4 赋予Tester 角色
//最后检查用户4 是不是Tester角色
roles.createPermission('Demo').then(() => {
    console.log("创建权限成功");
    roles.createRole('Tester').then(() => {
        console.log("创建角色--ok");
        roles.givePermission('Tester', 'Demo').then(() => {
            console.log("角色赋予权限--OK");
            roles.assignRole('Tester', 4).then(() => {
                console.log("用户赋予角色--OK");
                roles.hasRole('Tester', 4).then(() => {
                    console.log("用户角色检查 --ok");
                }).catch(() => {
                    console.log('用户角色检擦--err');
                })
            }).catch(() => {
                console.log("用户赋予角色---err");
            })
        }).catch(() => {
            console.log("角色赋予权限--err");
        })
    }).catch(() => {
        console.log("创建角色失败");
    })
}).catch(() => {
    console.log("创建权限失败");
})