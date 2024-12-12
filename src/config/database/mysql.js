const mysql = require('mysql2');
const config = require('../config');

const con = mysql.createConnection({
    host: config.sequelize.host,
    password: config.sequelize.password,
    user: config.sequelize.username,
    port: config.sequelize.port,
})

const createSchema = async () => {
    return new Promise(async (resolve, reject) => {
        con.connect((e) => {
            if (e) {
                return reject(e);
            }
            con.query(`create database ${config.sequelize.database}`, (e, result, fields) => {
                if (e) {
                    if (e.code === 'ER_DB_CREATE_EXISTS') {
                        resolve(true);
                    } else {
                        return reject(e);
                    }
                }
                resolve(true);
            })
            con.end();
        })
    })
}

module.exports = {
    createSchema
}
