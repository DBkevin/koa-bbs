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
        }
    }
}