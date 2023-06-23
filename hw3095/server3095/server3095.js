const express = require('express');
const cors = require('cors');
const webserver = express();

webserver.use(cors());
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

const fs = require('fs');
const path = require('path');
const os = require('os');

const port = 3095;
const logFilePath = path.join(__dirname, '_server.log');

const chosenOnes = [{FIO: 'Ivanov', code: 1, votes:  250},
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

    let response = [...chosenOnes].map((item) => {return {FIO: item.FIO, code: item.code}});

    res.status(200).send(response);
});

webserver.post('/stat', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/stat" endpoint called');

    let response = [...chosenOnes].map((item) => {return {votes: item.votes, code: item.code}});

    res.status(200).send(response);
});

webserver.post('/vote', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/vote" endpoint called');
    console.log(req.body);
    for (const item of chosenOnes) {
        if(item.code === parseInt(req.body.code)){
            item.votes++;
        }
    }

    console.log(chosenOnes);

    res.status(200).end();
});

webserver.get('/page', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/page" endpoint called');

    res.status(200).sendFile(`${__dirname}/index.html`);
});




webserver.listen(port,()=>{
    logLineSync(logFilePath,"web server3095 running on port "+port);
});
