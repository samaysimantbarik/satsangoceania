const mysql= require('mysql2');

// create the connection to database


const pool = mysql.createPool({
    host: 'remotemysql.com',
    user: '8W47r6rNlr',
    password: 'uSy9KeIEgW',
    database: '8W47r6rNlr',
    acquireTimeout: 30000, //30 secs
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;