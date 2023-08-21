const express = require('express');
const path = require('path');

const busboy = require('connect-busboy');

const fs = require('fs');
const {logLineAsync} = require("./utils");

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

const WebSocket = require('ws');
const portWS = 56951;
const server = new WebSocket.Server({ port: portWS });
server.binaryType = 'blob';
let clients=[];

const port = 5695;
const logFilePath = path.join(__dirname, '_server.log');

logLineAsync(logFilePath,"socket server running on port "+portWS);

webserver.use(function (req, res, next) {
    logLineAsync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    "/mysite",
    express.static(path.resolve(__dirname,"static"))
);

webserver.post('/upload/:id', busboy(), async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/upload EP called");

    const totalRequestLength = +req.headers["content-length"];
    let totalDownloaded = 0;

    let socketId = parseInt(decodeURIComponent(req.params['id']));

    let socketIndex;
    let socket = clients.find( (item, index) => {
        if(item.id === socketId){
            socketIndex = index;
            return true;
        }
    });

    if(!socket){
        res.status(400).end();
    }

    let reqFields = {};
    let reqFiles = {};

    req.pipe(req.busboy);

    req.busboy.on('field', function(fieldname, val) {
            reqFields[fieldname] = val;
    });

    req.busboy.on('file', (fieldname, file, info) => {

        reqFiles[fieldname]={originalFN:info.filename};

        logLineAsync(logFilePath,`Uploading of '${fieldname}' started`);

        const writeStream = fs.createWriteStream(path.join(__dirname,"upload", `${info.filename}`));

        file.pipe(writeStream);

        file.on('data', function(data) {
            totalDownloaded += data.length;
            logLineAsync(logFilePath,'loaded '+totalDownloaded+' bytes of '+totalRequestLength);
            if(socket !== null)
                socket.connection.send('loaded '+totalDownloaded+' bytes of '+totalRequestLength)
        }).on('close', () => {
            logLineAsync(logFilePath,'file  received');
            socket.connection.send('file received');

            clients.splice(socketIndex, 1);
            socket.connection.terminate();
            socket = null;

            logLineAsync(logFilePath,`[${portWS}] `+"websocket connection closed");
        });
    });

    res.status(200).end();
});

webserver.listen(port,()=>{
    logLineAsync(logFilePath,"web server running on port "+port);
});


server.on('connection', connection => {
    logLineAsync(logFilePath,`[${portWS}] `+"new connection established");

    connection.send('hello from server to client!');
    connection.on('message', async message => {
            const reader = await new Response(message).text();
            let data = JSON.parse(reader);
            clients.push({id: data.wsReqId, connection: connection});
    });
});

