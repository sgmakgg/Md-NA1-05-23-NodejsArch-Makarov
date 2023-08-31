const express = require('express');
const path = require('path');

const fs = require('fs');
const fsp = fs.promises;
const {logLineAsync, escapeHTML} = require("./utils");

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

const port = 6195;
const logFilePath = path.join(__dirname, '_server.log');

const mysql=require("mysql");
const {poolConfig} = require("./db/poolConfig");
const {newConnectionFactory, selectQueryFactory} = require("./db/db_utils");
let pool = mysql.createPool(poolConfig);

function reportServerError(error,res) {
    res.status(500).end();
    logLineAsync(logFilePath,`[${port}] `+error);
}

function reportRequestError(error,res) {
    res.status(400).end();
    logLineAsync(logFilePath,`[${port}] `+error);
}

webserver.use(function (req, res, next) {
    logLineAsync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    "/mysite",
    express.static(path.resolve(__dirname,"static"))
);

//READ
webserver.get('/read', async (req, res) => {
    logLineAsync(logFilePath,`[${port}] `+"/select endpoint called");

    let connection=null;
    try {
        connection=await newConnectionFactory(pool,res);

        let queryText = escapeHTML(decodeURIComponent(req.query.sqlReq));
        let sqlResult = await selectQueryFactory(connection, queryText, []);

        res.send(sqlResult);
    }
    catch ( error ) {
        reportServerError(error,res); // сюда прилетят любые ошибки
    }
    finally {
        if ( connection )
            connection.release(); // соединение надо закрыть (вернуть в пул) независимо от успеха/ошибки
    }
});

webserver.listen(port,()=>{
    logLineAsync(logFilePath,"web server running on port "+port);
});