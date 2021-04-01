exports = module.exports = (ctx, user_id) => {
    if (ctx.session.user) {
        if (ctx.session.user.id !== user_id) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
