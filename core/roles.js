const db = require('../core/db');
const auth = require('../middleware/auth');
//检查用户角色
/**
 * 检查权限
 *
 * @param     {[type]}    name    [name description]
 *
 * @return    {[type]}            [return description]
 */
async  function hasRole(name) {
    if (!isAuth()) {
        return false;
    } else {
        //先根据角色名称来查询权限ID，
        let name = db.escape(name);
        let rolesSQL = `select id from roles where name=${name}`;
        let roles= await db.query(rolesSQL);
        if (!roles) {
            return false;
        } else {
            let isHshRoleSQL = `select * from model_has_roles where role_id=${roles[0].id} and model_id=${user_id}`;
            let isHas = await db.query(isHshRoleSQL);
            if (isHas) {
                return true;
            } else {
                return false;
            }
        }
        //然后根据权限id来查看是否关联当前用户
    }
}

function isAuth() {
    //先获取当前登陆的id
    let user_id = ctx.session.user.id;
    if (!user_id) {
        ctx.session.info = {
            danger: '请先登陆!',
        };
        return false;
    } else {
        return true;
    }
}
/**
 * 获取用户信息
 *
 * @param     {[int]}    user_id    用户ID
 *
 * @return    {(boolean|object)}               返回用户信息或false
 */
 function getUserInfo(user_id) {
    let userId = db.escape(user_id);
    let userInfoSQL = `select * from users where id=${userId}`;
    db.query(userInfoSQL).then(data => {
        if (data) {
            return data[0];
        }
    })
    if (!userInfo) {
        return false;
    } else {
        return userInfo[0];
    }
}
/**
 * 获取角色(role)信息
 *
 * @param     {string}    role_name    要获取的角色(role)名称
 *
 * @return    {(boolean|object)}                 返回false或角色详情对象
 */
async function getRoleInfo(role_name) {
    let roleName = db.escape(role_name);
    let roleInfoSQL = `select * from roles where name=${roleName}`;
    let roleInfo = await db.query(roleInfoSQL);
    if (roleInfo) {
        return roleInfo[0];
    } else {
        return false;
    }
}
/**
 * 为用户赋予角色
 *
 * @param     {string}    RoleName    赋予的角色名称
 * @param     {int}       user      要赋予的用户ID,默认当前用户 
 * @return    {boolean}          赋予成功返回ture,否则返回false
 */
async function assignRole(RoleName,user=ctx.session.user.id) {
    //先确认任务是否真的存在
    let userInfo = getUserInfo(user);
    console.log(userInfo);
    if (userInfo) {
        //确认权限是否存在
        let roleInfo = getRoleInfo(RoleName);
        console.log(roleInfo);
        if (roleInfo) {
            let SQL = `insert into model_has_roles (role_id,model_type,model_id) values(${roleInfo.id},'user',${userInfo.id})`;
            console.log(SQL);
            let model_has_roles = await db.query(SQL);
            if (model_has_roles) {
                return true;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
exports = module.exports = {
    hasRole,
    assignRole,
}