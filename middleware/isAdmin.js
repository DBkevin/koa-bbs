const roles = require('../core/roles');
exports = module.exports = () => {
    return async (ctx, next) => {
        if (ctx.session.user) {
            roles.hasRole('Maintainer', ctx.session.user.id).then(() => {
                return true;
            }).catch(() => {
                return false;
            })
        } else {
            return false;
        }
    }
}