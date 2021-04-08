const db = require('../core/db');

/**
 * 获取角色(role)信息
 *
 * @param     {string}    role_name    要获取的角色(role)名称
 *
 * @return    {(boolean|object)}                 返回false或角色详情对象
 */
async function getRoleInfo(role_name) {
    let roleName = db.cape(role_name);
    let roleInfoSQL = `select * from roles where name=${roleName}`;
    let roleInfo = await db.query(roleInfoSQL);
    if (roleInfo) {
        return roleInfo[0];
    } else {
        return false;
    }
}
exports.getRoleInfo = getRoleInfo;
