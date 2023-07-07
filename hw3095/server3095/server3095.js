const express = require('express');
const cors = require('cors');
const webserver = express();

webserver.use(cors());
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

const fs = require('fs');
const path = require('path');
const os = require('os');
const X2JS = require("x2js");

const port = 3095;

const logFilePath = path.join(__dirname, '_server.log');

const statFilePath = path.join(__dirname, 'statistic.txt');
let openedStatFile = fs.openSync(statFilePath, 'a+');
fs.closeSync(openedStatFile);

let chosenOnes = [{FIO: 'Ivanov', code: 1, votes:  250},
                                                {FIO: 'Petrov',code: 2, votes: 200},
                                                {FIO: 'Sidorov',code: 3, votes: 100500}];

function logLineSync(logFilePath,logLine) {
    const logDate=new Date();
    let time=logDate.toLocaleDateString()+" "+logDate.toLocaleTimeString();
    let fullLogLine=time+" "+logLine;

    console.log(fullLogLine);

    const logFileRecord = fs.openSync(logFilePath, 'a+');
    fs.writeSync(logFileRecord, fullLogLine + os.EOL);
    fs.closeSync(logFileRecord);
}

webserver.get('/variants', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/variants" endpoint called');

    let statFileData = fs.readFileSync(statFilePath,'utf8');
    let data = (statFileData.length === 0) ? [...chosenOnes] : JSON.parse(statFileData);

    let response = data.map((item) => {return {FIO: item.FIO, code: item.code}});

    res.status(200).send(response);
});

webserver.post('/stat', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/stat" endpoint called');

    let statFileData = fs.readFileSync(statFilePath,'utf8');
    let data = (statFileData.length === 0) ? [...chosenOnes] : JSON.parse(statFileData);

    let response = data.map((item) => {return {votes: item.votes, FIO: item.FIO}});

    res.status(200).send(response);
});

webserver.post('/vote', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/vote" endpoint called');
    console.log(req.body);

    let statFileData = fs.readFileSync(statFilePath,'utf8');
    let data = (statFileData.length === 0) ? [...chosenOnes] : JSON.parse(statFileData);

    let updatingData = [...data];
    for (const item of updatingData) {
        if(item.code === parseInt(req.body.code)){
            item.votes++;
        }
    }

    const statFileRecord = fs.openSync(statFilePath, 'w');
    fs.writeSync(statFileRecord, JSON.stringify(updatingData));
    fs.closeSync(statFileRecord);

    console.log(chosenOnes);

    res.status(200).end();
});

webserver.get('/page', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/page" endpoint called');

    res.status(200).sendFile(`${__dirname}/index.html`);
});

webserver.get('/downloads', (req, res) => {
    const clientAccept=req.headers.accept;
    logLineSync(logFilePath,`[${port}] `+'"/download" endpoint called ' + `${clientAccept}`);

    let statFileData = fs.readFileSync(statFilePath,'utf8');
    let data = (statFileData.length === 0) ? [...chosenOnes] : JSON.parse(statFileData);

    if ( clientAccept==="application/json" || clientAccept==="application/html") {
        res.setHeader("Content-Type", "application/json");

        res.send(data);
    }
    else if ( clientAccept==="application/xml" ) {
        res.setHeader("Content-Type", "application/xml");
        let x2js = new X2JS();
        let xmlAsStr = x2js.js2xml(data);

        res.send(xmlAsStr);
    }
    else {
        res.status(501).end();
    }
});

webserver.listen(port,()=>{
    logLineSync(logFilePath,"web server3095 running on port "+port);
});