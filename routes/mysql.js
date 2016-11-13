var ejs = require('ejs');
var mysql = require('mysql');



var poolS = 50;
var pool =[];


//To get the connection of the database, putting credentials

function getConnection(){
    var connection = mysql.createConnection({
        host      :   'localhost',
        user      :   'root',
        password  :   'test123',
        database  :   'test',
        port      :   3306
    });
    return connection;
}

exports.createConnectionPool= function createConnectionPool(){
    for(var i=0; i<poolS;i++){
        pool.push(getConnection());
    }

}
function getConnectionFromPool(){
    if(pool.length<=0){
        console.log("CCCCC");
        return null;
    }
    else{
        return pool.pop();

    }

}

function getData(callback, sqlQuery){
    console.log("\nSQL Query::"+sqlQuery);

    var connection = getConnectionFromPool();

    connection.query(sqlQuery, function(err,rows,fields){
        if(err){ //if there is an error
            console.log("ERROR: "+ err.message);
            callback(err,rows);
        }
        else{ //return err or results
            console.log("Database Results:" + rows);
            callback(err,rows);
        }

    });
    console.log("\nConnection closed....");
    connection.end();
}

exports.getData = getData;