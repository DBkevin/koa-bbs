const db = require('../core/db');
const { getRoleInfo } = require("./getRoleInfo");
const { getUserInfo } = require("./getUserInfo");

/**
 * 检查用户是否是指定角色
 *
 * @param     {type}    name    角色名称，字符串
 * @param     {int}    user_id    用户ID，数字
 * @return    {boolean}           存在权限返回true，否则false
 */
async function hasRole(name, user_id = ctx.session.user.id) {
    let userInfo = await getUserInfo(user_id);
    if (userInfo) {
        //先根据角色名称来查询权限ID，
        let role = await isRole(name);
        if (role) {
            let isHshRoleSQL = `select * from model_has_roles where role_id=${role[0].id} and model_id=${userInfo.id}`;
            let isHashRole = await db.query(isHshRoleSQL);
            if (isHashRole) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }

}
/**
 * 检查指定角色是否存在
 *
 * @param     {string}    role_name    待检查的角色名
 *
 * @return    {(boolean|object)}       存在该角色就返回该角色id，不存在返回false
 */
async function isRole(role_name) {
    let roleName = db.cape(role_name);
    let rolesSQL = `select * from roles where name=${roleName}`;
    let role = await db.query(rolesSQL);
    if (role) { return role } else { return false }
}
/**
 * 检查指定权限是否存在
 *
 * @param     {string}   permission_name    待检查的权限名
 *
 * @return    {(boolean|object)}       存在该权限就返回该权限id，不存在返回false
 */
async function isPermission(permission_name) {
    let permissionName = db.cape(permission_name);
    let permissionSQL = `select * from  permissions where name=${permissionName}`;
    let permission = await db.query(permissionSQL);
    if (permission) { return permission } else { return false }


}
/**
 * 为用户赋予角色
 *
 * @param     {string}    RoleName    赋予的角色名称
 * @param     {int}       user      要赋予的用户ID,默认当前用户 
 * @return    {boolean}          赋予成功返回ture,否则返回false
 */
async function assignRole(RoleName, user = ctx.session.user.id) {
    //先确认用户是否真的存在
    let userInfo = await getUserInfo(user);
    if (userInfo) {
        //确认权限是否存在
        let roleInfo = await getRoleInfo(RoleName);
        console.log(roleInfo);
        if (roleInfo) {
            let SQL = `insert into model_has_roles (role_id,model_type,model_id) values(${roleInfo.id},'user',${userInfo.id})`;
            console.log(SQL);
            db.query(SQL).then(() => {
                return true;
            }).catch(() => {
                return false;
            })
        } else {
            false;
        }

    } else {
        return false;
    }
}

/**
 * 新建角色
 *
 * @param     {string}    role_name    要新建的角色名称
 *
 * @return    {boolean}                 返回创建结果，已经存在该角色和新创建成功返回true，否则返回false
 */
async function createRole(role_name) {
    //先查看是否有该角色
    let role = await isRole(role_name);
    if (role) {
        return true;
    } else {
        let roleName = db.cape(role_name);
        let createRoleSQL = `insert into roles (name,guard_name) values(${roleName},'web') `;
        let createRole = await db.query(createRoleSQL);
        if (createRole) {
            return true;
        } else {
            return false;
        }
    }
}
/**
 * 新建权限
 *
 * @param     {string}   permission_name  要新建的权限名称
 *
 * @return    {boolean}                 返回创建结果，已经存在该角色和新创建成功返回true，否则返回false
 */
async function createPermission(permission_name) {
    //先查看是否有该角色
    let permission = await isPermission(permission_name);
    if (permission) {
        return true;
    } else {
        let permissionName = db.cape(permission_name);
        let createPermissionSQL = `insert into permissions (name,guard_name) values(${permissionName},'web') `;
        let permission = await db.query(createPermissionSQL);
        if (permission) {
            return true;
        } else {
            return false;
        }
    }
}
async function givePermission(role, permission) {
    let roleInfo = await isRole(role);
    let permissionInfo = await isPermission(permission);
    if (roleInfo && permissionInfo) {
        let giveSQL = `insert into role_has_permissions (permission_id,role_id) values(${permissionInfo[0].id},${roleInfo[0].id})`;
        let give = await db.query(giveSQL);
        if (give) {
            return true;
        } else {
            return false;
        }

    }
}
exports = module.exports = {
    hasRole,
    assignRole,
    createRole,
    createPermission,
    givePermission
}