const express = require('express');
const path = require('path');

const fs = require('fs');
const fsp = fs.promises;

const {logLineAsync, escapeHTML} = require("./utils");
const logFilePath = path.join(__dirname, '_server.log');

//webserver
const webserver = express();
webserver.use(express.urlencoded({extended:true}));
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');

//websocket
const WebSocket = require('ws');
const portWS = 56951;
const WebSocketServer = new WebSocket.Server({ port: portWS });
WebSocketServer.binaryType = 'blob';
let clients=[];

//db
const port = 5695;

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

webserver.use(function (req, res, next) {
    logLineAsync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    "/mysite",
    express.static(path.resolve(__dirname,"static"))
);

webserver.post('/upload/:id', busboy(), async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/upload/:id EP called");

    let fileObj = {fName:'', comment:''};

    const totalRequestLength = +req.headers["content-length"];
    let totalDownloaded = 0;
    let wsMess = {name: "", value: ''};

    let socketId = parseInt(decodeURIComponent(req.params['id']));

    if(isNaN(socketId))
        res.status(400).end();

    let socketIndex;
    let socket = clients.find( (item, index) => {
        if(item.id === socketId){
            socketIndex = index;
            return true;
        }
    });

    if(!socket)
        res.status(400).end();

    req.pipe(req.busboy);

    req.busboy.on('field', function(fieldname, val) {
            fileObj.comment = val;
    });

    req.busboy.on('file', (fieldname, file, info) => {
        fileObj.fName = Buffer.from(info.filename, 'latin1').toString('utf8');

        logLineAsync(logFilePath,`Uploading of '${fileObj.fName}' started`);

        const writeStream = fs.createWriteStream(path.join(__dirname,"upload", `${fileObj.fName}`));

        file.pipe(writeStream);

        file.on('data', function(data) {
            totalDownloaded += data.length;
            logLineAsync(logFilePath,'loaded '+totalDownloaded+' bytes of '+totalRequestLength);
            if(socket !== null){
                let width = (totalDownloaded/totalRequestLength)*100;
                wsMess = {name: "progress", value: width};
                socket.connection.send(JSON.stringify({name: "console", value: 'loaded '+totalDownloaded+' bytes of '+totalRequestLength}));
                socket.connection.send(JSON.stringify(wsMess));
            }

        }).on('close', () => {
            logLineAsync(logFilePath,'WS file progress sent to client');

            socket.connection.send(JSON.stringify({name: "progress", value: 100}));
            socket.connection.send(JSON.stringify({name: "console", value: 'WS file progress sent to client'}));
            socket.connection.terminate();

            logLineAsync(logFilePath,`[${portWS}] `+"websocket connection closed");
        });
    });
    req.busboy.on('finish', async () =>{
        clients.splice(socketIndex, 1);
        socket = null;
        const filePath = path.join(__dirname, 'files.txt');
        let record;
        let fileData
        try{
            await fsp.access(filePath);
            fileData = await readFile(filePath);
            fileData.push(fileObj);
            record = await fsp.open(filePath, 'w');
        }
        catch{
            let createStream = fs.createWriteStream(filePath);
            createStream.end();
            record = await fsp.open(filePath, 'w');
            fileData = [];
            fileData.push(fileObj);

        }
        finally {
            await fsp.writeFile(record, JSON.stringify(fileData));
            record.close();
            res.status(200).end();
        }
    });
});

webserver.get('/files', async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/files EP called");

    res.headers = {'Content-Type': 'application/json'};
    let filePath = path.join(__dirname, 'files.txt');
    try{
        await fsp.access(filePath);
        let fileData = await fsp.readFile(filePath,'utf8');
        res.send(fileData);
    }
    catch{
        res.status(400).end();
    }
});

webserver.get('/file/:name', async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/file/:name EP called");

    let fileName = decodeURIComponent(req.params['name']);

    fileName = escapeHTML(fileName);

    let filePath = path.join(__dirname, 'upload', fileName);

    try{
        await fsp.access(filePath);
        logLineAsync(logFilePath,`[${port}] file: ${fileName} is downloading`);
        res.setHeader("Content-Disposition", "attachment");
        let readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    }
    catch{
        res.status(400).end();
    }
});

webserver.listen(port,()=>{
    logLineAsync(logFilePath,"web server running on port "+port);
});


WebSocketServer.on('connection', connection => {
    logLineAsync(logFilePath,`[${portWS}] `+"new connection established");

    connection.send('hello from server to client!');
    connection.on('message', async message => {
            const reader = await new Response(message).text();
            let data = JSON.parse(reader);
            clients.push({id: data.wsReqId, connection: connection});
    });
});

async function readFile(filePath){
    let fileData = await fsp.readFile(filePath,'utf8');
    return JSON.parse(fileData);
}

