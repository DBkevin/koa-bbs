exports = module.exports = (ctx, user_id) => {
    if (ctx.session.user.id !== user_id) {
        ctx.session.info = {
            danger: '权限不足!',
        };
        return false;
    } else {
        return true;
    }
}
