const mysql= require('mysql2/promise');

var config = require('config');
// create the connection to database


const pool = mysql.createPool({
    // host: 'remotemysql.com',
    // user: '8W47r6rNlr',
    // password: 'uSy9KeIEgW',
    // database: '8W47r6rNlr',

    host: config.get("db.host"),
    user: config.get("db.user"),
    password: config.get("db.password"),
    database: config.get("db.database"),
    acquireTimeout: 30000, //30 secs
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;