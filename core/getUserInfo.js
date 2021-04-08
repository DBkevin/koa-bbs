const db = require('../core/db');

/**
 * 获取用户信息
 *
 * @param     {[int]}    user_id    用户ID
 *
 * @return    {(boolean|object)}               返回用户信息或false
 */
async function getUserInfo(user_id) {
    let userId = db.cape(user_id);
    let userInfoSQL = `select * from users where id=${userId}`;
    let userInfo = await db.query(userInfoSQL);
    if (userInfo) {
        return userInfo[0];
    } else {
        return false;
    }
}
exports.getUserInfo = getUserInfo;
