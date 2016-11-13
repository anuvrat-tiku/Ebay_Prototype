var ejs = require('ejs');
var mysql = require('mysql');

function est_connection() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'anuvrattiku',
        password: 'India_123',
        database: 'lab1',
        port: 3306,

    });
    return connection;
}

//Getting the information from the database
function getData(callback, sqlQuery) {
    console.log("SQL Query : " + sqlQuery);

    var connection = est_connection();
    connection.query(sqlQuery, function(err, rows, fields) {
        if (err) {
            console.log("Error : " + err.message);
        } else {
            console.log("DB results : " + rows);
            callback(err, rows);
        }
    });

    console.log("\nconnection closed");
    connection.end();
}

exports.getData = getData;