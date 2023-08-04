const mysql = require('mysql');

const dbConfig = {
    host:'localhost',
    user:'root',
    password:'12345',
    database:'test_db',
    port: 3306,
}


function createConnection () {
    const connection = mysql.createConnection(dbConfig)
    return connection; 
}

module.exports = { createConnection };