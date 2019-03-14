const mysql= require('mysql2');

// create the connection to database


const pool = mysql.createPool({
    host: 'www.db4free.net',
    user: 'satsang',
    password: 'Test@1234',
    database: 'satsang',
    acquireTimeout: 30000, //30 secs
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;