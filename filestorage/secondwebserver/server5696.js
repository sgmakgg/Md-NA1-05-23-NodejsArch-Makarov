const express = require('express');
const path = require('path');

const fs = require('fs');
const fsp = fs.promises;

//https
let https = require('https');

// selfsigned cert command
// openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365
let privateKey  = fs.readFileSync('cert/key.pem');
let certificate = fs.readFileSync('cert/cert.pem');
let credentials = {key: privateKey, cert: certificate, passphrase:'qwerty'};

//logging
const {logLineAsync, escapeHTML} = require("./utils");
const logFilePath = path.join(__dirname, '_server.log');

//webserver
const webserver = express();
const port = 5696;
webserver.use(express.urlencoded({extended:true}));
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');

let clients=[];

//db
const mysql=require("mysql");
const {poolConfig} = require("./db/poolConfig");
const {newConnectionFactory, selectQueryFactory, modifyQueryFactory} = require("./db/db_utils");
let pool = mysql.createPool(poolConfig);

//session
let session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
                                    clearExpired: true,
                                    checkExpirationInterval: (1000*60*15), //900000
                                    expiration: (1000*60*60*24), //86400000
                                    createDatabaseTable: true,
                                    endConnectionOnClose: true }/* session store options */,
                                    pool);

//email
const {sendEmail, mailOptions} = require("./email/nodemailer");
const {transporter} = require("./email/transportConfig");

//host
const host = process.env.NODE_ENV === 'production' ? 'msnodearch.elmiservis.by' : 'localhost';

//storage
const storagePath = path.join('../upload');
if(!fs.existsSync(path.join(storagePath))){
    fsp.mkdir(path.join(storagePath));
}

let auth = function (req, res, next){
    logLineAsync(logFilePath, "auth middleware , authentication status: " + req.session.user_auth);

    if(req.session.user_auth !== undefined){
        next();
    }
    else{
        res.status(401).end();
    }
}

function reportServerError(error,res) {
    res.status(500).end();
    logLineAsync(logFilePath,`[${port}] `+error);
}

function reportRequestError(error,res) {
    res.status(400).send(error);
    logLineAsync(logFilePath,`[${port}] `+error);
}

webserver.use(bodyParser.json());

webserver.use(function (req, res, next) {
    logLineAsync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    "/mysite",
    express.static(path.resolve(__dirname,"static"))
);

webserver.use(session({
    key: 'user_session',
    secret: 'user_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

webserver.post('/auth', async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/auth EP called", req.body);

    let validationOk = true;

    if(req.body === {} || req.body.email === '' || req.body.password ===''){
        validationOk =false;
    }

    let connection=null;
    if(validationOk){
        if(req.body.authType === 'registration'){
            try {
                let emailVerificationRef = Math.floor(Math.random() * 100000);

                connection = await newConnectionFactory(pool, res);
                await modifyQueryFactory(connection,
                    `insert into users(name, email, password, email_verification_ref, email_verified) 
                        values(?,?,?,?,?);`,
                    [req.body.name, req.body.email, req.body.password, emailVerificationRef, false]);


                mailOptions.to = req.body.email;
                mailOptions.text = 'verification reference:' + `https://${host}:8444/verification/${emailVerificationRef}`;
                sendEmail(transporter, mailOptions);

                res.status(201).end();
            }
            catch (err) {
                reportServerError(err,res);
            }
            finally {
                if ( connection )
                    connection.release();
            }
        }
        else if(req.body.authType === 'login'){
            connection = await newConnectionFactory(pool, res);

            try{
                let userObj = await selectQueryFactory(connection,
                    `select email_verified 
                            from users
                            where email=? and password=?;`,
                    [req.body.email, req.body.password]);

                if(userObj.length !== 0 && userObj[0].email_verified){
                    req.session.user_auth = true;
                    req.session.user_email = req.body.email;
                    res.status(200).end();
                }
                else{
                    res.status(401).end();
                }
            }
            catch (err) {
                reportServerError(err,res);
            }
            finally {
                if ( connection )
                    connection.release();
            }
        }
        else{
            req.session.destroy();
            res.status(401).end();
        }
    }
    else {
        reportRequestError('Validation error', res);
    }
});

webserver.get('/logout', auth, (req, res)=>{
    res.set({'Cache-Control':'no-cache',
            'Pragma':'no-cache'}); // http 1.1 & 1.0

    req.session.destroy();
    res.status(200).end();
});

webserver.get('/verification/:emailVerificationRef', async(req, res)=>{
    res.set({'Cache-Control':'no-cache',
            'Pragma':'no-cache'}); // http 1.1 & 1.0

    let connection;
    try{
        let emailVerificationRef = parseInt(req.params['emailVerificationRef']);
        logLineAsync(logFilePath,`[${port}] `+"/verification/:emailVerificationRef  called " + emailVerificationRef);

        connection = await newConnectionFactory(pool, res);

        let user = await selectQueryFactory(connection,
            `SELECT user_id FROM users WHERE email_verification_ref = ?`,
            [emailVerificationRef]);

        await modifyQueryFactory(connection,
            `UPDATE users
                    SET email_verified = TRUE, email_verification_ref = NULL
                    WHERE user_id  = ?;`,
            [user[0].user_id]);

        res.redirect(301, `https://${host}:8444/mysite`);
    }
    catch (err) {
        res.status(500).end();
    }
    finally {
        if ( connection )
            connection.release();
    }
});

webserver.post('/upload/:id', auth, busboy(), async (req, res)=>{

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

    req.busboy.on('file', async (fieldname, file, info) => {
        fileObj.fName = Buffer.from(info.filename, 'latin1').toString('utf8');

        logLineAsync(logFilePath,`Uploading of '${fileObj.fName}' started`);

        if(!fs.existsSync(path.join(storagePath, req.session.user_email))){
            await fsp.mkdir(path.join(storagePath, req.session.user_email));
        }

        const writeStream = fs.createWriteStream(path.join(storagePath, req.session.user_email, `${fileObj.fName}`));

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

            socket.connection.send(JSON.stringify({name: "console", value: 'WS file progress sent to client'}));
            socket.connection.terminate();

            logLineAsync(logFilePath,`[${portWS}] `+"websocket connection closed");
        });
    });
    req.busboy.on('finish', async () =>{
        clients.splice(socketIndex, 1);
        socket = null;
        const filePath = path.join(storagePath, req.session.user_email, 'files.txt');
        let record;
        let fileData
        try{
            await fsp.access(filePath);
            fileData = await readFile(filePath);
            let arr = fileData.filter(item => {
                if(item.fName !== fileObj.fName)
                    return item;
            });
            arr.push(fileObj);
            fileData = arr;
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

webserver.get('/files', auth, async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/files EP called");

    res.set({'Cache-Control':'no-cache',
        'Pragma':'no-cache',
        'Content-Type': 'application/json'});

    let filePath = path.join(storagePath, req.session.user_email, 'files.txt');
    try{
        await fsp.access(filePath);
        let fileData = await fsp.readFile(filePath,'utf8');
        res.send(fileData);
    }
    catch{
        res.status(400).end();
    }
});

webserver.get('/file/:name', auth, async (req, res)=>{
    logLineAsync(logFilePath,`[${port}] `+"/file/:name EP called");

    res.set({'Cache-Control':'no-cache',
        'Pragma':'no-cache'}); // http 1.1 & 1.0

    let fileName = decodeURIComponent(req.params['name']);

    fileName = escapeHTML(fileName);

    let filePath = path.join(storagePath, req.session.user_email, fileName);

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

// https server
if(process.env.NODE_ENV !== 'production'){
    let httpsServer = https.createServer(credentials, webserver);
    httpsServer.listen(8444);
}

//websocket server
let wss = https.createServer(credentials);

const WebSocket = require('ws');
const portWS = (process.env.NODE_ENV === 'production')? 56961 : 6196;
const WebSocketServer = (process.env.NODE_ENV === 'production') ? new WebSocket.Server({port:portWS}) : new WebSocket.Server({server: wss});
WebSocketServer.binaryType = 'blob';

if(process.env.NODE_ENV !== 'production') {
    wss.listen(portWS);
}

WebSocketServer.on('connection', connection => {
    logLineAsync(logFilePath,`[${portWS}] `+"new connection established");

    connection.send(JSON.stringify({name: "console", value: 'Web socket connection established'}));
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

