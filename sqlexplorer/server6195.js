const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const {logLineAsync, escapeHTML} = require("./utils");

const helmet = require('helmet');

const webserver = express();
webserver.use(express.urlencoded({extended:true}));


const port = 6195;
const logFilePath = path.join(__dirname, '_server.log');

const mysql=require("mysql");
const {poolConfig} = require("./db/poolConfig");
const {newConnectionFactory, selectQueryFactory, modifyQueryFactory} = require("./db/db_utils");
let pool = mysql.createPool(poolConfig);

function reportServerError(error,res) {
    res.status(500).end();
    logLineAsync(logFilePath,`[${port}] `+error);
}

function reportRequestError(error,res) {
    res.status(400).send(error);
    logLineAsync(logFilePath,`[${port}] `+error);
}

webserver.use(helmet({
    contentSecurityPolicy: false,
}));

webserver.use(bodyParser.text({ type: 'text/html' }));

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
        reportServerError(error,res);
    }
    finally {
        if ( connection )
            connection.release();
    }
});

//CREATE
webserver.post('/create', async(req,res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/create endpoint called");

    let connection=null;

    try {
        connection=await newConnectionFactory(pool,res);

        let queryText = req.body;
        let sqlResult = await modifyQueryFactory(connection, queryText, []);

        res.send(sqlResult);
    }
    catch ( error ) {
        console.log(error);
        reportRequestError(error,res);
    }
    finally {
        if ( connection )
            connection.release();
    }
});

//UPDATE
webserver.put('/modify', async (req, res) =>{
    logLineAsync(logFilePath,`[${port}] `+"/modify endpoint called");

    let connection=null;

    try {
        connection=await newConnectionFactory(pool,res);

        let queryText = req.body;
        let data = await modifyQueryFactory(connection, queryText, []);

        res.send(data);
    }
    catch ( error ) {
        console.log(error);
        reportServerError(error,res);
    }
    finally {
        if ( connection )
            connection.release();
    }
});

//delete
webserver.delete('/delete', async (req, res) =>{
    logLineAsync(logFilePath,`[${port}] `+"/delete endpoint called");

    let connection=null;

    try {
        connection=await newConnectionFactory(pool,res);

        let queryText = req.body;
        let data = await modifyQueryFactory(connection, queryText, []);

        res.send(data);
    }
    catch ( error ) {
        console.log(error);
        reportServerError(error,res);
    }
    finally {
        if ( connection )
            connection.release();
    }
});


webserver.listen(port,()=>{
    logLineAsync(logFilePath,"web server running on port "+port);
});