const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

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

webserver.get('/stat', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/stat" endpoint called');

    res.status(200).send(chosenOnes);
});

webserver.post('/vote', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/vote" endpoint called');

    for (const item of chosenOnes) {
        if(item.code === parseInt(req.body.code)){
            item.votes++;
        }
    }

    res.status(200).end();
});

webserver.listen(port,()=>{
    logLineSync(logFilePath,"web server3095 running on port "+port);
});
