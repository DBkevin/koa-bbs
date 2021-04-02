exports = module.exports = (ctx, user_id,topic_userid) => {
    if (ctx.session.user) {
        if (ctx.session.user.id == user_id || ctx.session.user.id ==topic_userid) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
