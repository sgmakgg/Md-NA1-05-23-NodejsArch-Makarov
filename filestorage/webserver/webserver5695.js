const express = require('express');
const path = require('path');

const busboy = require('connect-busboy');

const fs = require('fs');
const {logLineAsync} = require("./utils");

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

const WebSocket = require('ws');

const portWS = 56951;



let clients=[]; // здесь будут объекты вида { connection:, lastkeepalive:NNN }

const port = 5695;
const logFilePath = path.join(__dirname, '_server.log');

const server = new WebSocket.Server({ port: portWS }); // создаём сокет-сервер на порту 5632
logLineAsync(logFilePath,"socket server running on port "+portWS);

webserver.use(function (req, res, next) {
    logLineAsync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    "/mysite",
    express.static(path.resolve(__dirname,"static"))
);

let socket = null;
webserver.post('/upload', busboy(), async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/upload EP called");

    const totalRequestLength = +req.headers["content-length"]; // общая длина запроса
    let totalDownloaded = 0; // сколько байт уже получено

    let reqFields = {}; // здесь будет собираться информация обо всех полях запроса, кроме файлов
    let reqFiles = {}; // здесь буте собираться информация обо всех файлах

    req.pipe(req.busboy);

    req.busboy.on('field', function(fieldname, val) { // это событие возникает, когда в запросе обнаруживается "простое" поле, не файл
        reqFields[fieldname] = val;
    });

    req.busboy.on('file', (fieldname, file, info, mimetype) => {  // это событие возникает, когда в запросе обнаруживается файл

        reqFiles[fieldname]={originalFN:info.filename};

        logLineAsync(logFilePath,`Uploading of '${fieldname}' started`);

        const writeStream = fs.createWriteStream(path.join(__dirname,"upload", `${info.filename}`));

        file.pipe(writeStream);

        file.on('data', async function(data) {
            totalDownloaded += data.length;
            logLineAsync(logFilePath,'loaded '+totalDownloaded+' bytes of '+totalRequestLength);
            if(socket !== null)
                socket.send('loaded '+totalDownloaded+' bytes of '+totalRequestLength)
        });


        file.on('end', () => {
            logLineAsync(logFilePath,'file  received');
            // socket.terminate();
            socket.send('file received');
            logLineAsync(logFilePath,`[${portWS}] `+"websocket connection closed");
        });
    });


    res.status(200).end();
});

webserver.listen(port,()=>{
    logLineAsync(logFilePath,"web server running on port "+port);
});


server.on('connection', connection => {

    socket = connection;
    logLineAsync(logFilePath,`[${portWS}] `+"new connection established");

    connection.send('hello from server to client!');

    connection.on('message', message => {
        if ( message==="KEEP_ME_ALIVE" ) {
            clients.forEach( client => {
                if ( client.connection===connection )
                    client.lastkeepalive=Date.now();
            } );
        }
        else
            console.log('сервером получено сообщение от клиента: '+message)
    });
});

