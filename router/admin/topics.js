const db = require("../../core/db");
exports = module.exports = {
    async createCategory(ctx, next) {
        console.log(ctx.request.body);
        console.log(ctx.method);
        let { name, description } = db.escape(ctx.request.body, ['name', 'description']);
        let isNameSQL = `select * from categories where name=${name}`;
        let isName = await db.query(isNameSQL);
        if (isName) {
            let errors = {
                name: '类名已经存在',
                description: '类名已经存在--descript',
            };
            ctx.status = 409;
            ctx.body = JSON.stringify(errors);
        } else {
            let insertCategorySQL = `insert into categories(name,description) value(${name},${description});`;
            let insertCategory = await db.query(insertCategorySQL);
            if (insertCategory) {
                ctx.set("Content-Type", "application/json")
                ctx.status = 200;
                let msg = {
                    name: `新增:${name}，成功！`
                }
                ctx.body = JSON.stringify(msg);
            }
        }
    }
}