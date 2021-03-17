const { dbName, dbHost, port, dbUser, dbPass } = require('../config/index').database;
const mysql = require('mysql');
let pools = {};
//创建一个connection
module.exports=query = (sql, host = "127.0.0.1") => {
    if (!pools.hasOwnProperty(host)) {
        pools[host] = mysql.createPool({
            host: dbHost,
            prot: port,
            user: dbUser,
            password: dbPass,
            database: dbName,
        });
    }
    return new Promise((resolve, reject) => {
        pools[host].getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, (err, result) => {
                    if (err) reject(err);
                    if (result) {
                        if (result.length === 0) {
                            resolve(false);
                        } else {
                            let string = JSON.stringify(result);
                            let data = JSON.parse(string);
                            resolve(data);
                        }
                    }
                    connection.release();
                });
            }
        });
    });
}
