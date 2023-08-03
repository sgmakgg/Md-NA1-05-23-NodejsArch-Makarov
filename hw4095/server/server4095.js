const express = require('express');
const cors = require('cors');
const webserver = express();

const fs = require('fs');
const path = require('path');
const os = require('os');

const port = 4095;

const logFilePath = path.join(__dirname, '_server.log');

webserver.use(cors());
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());



function logLineSync(logFilePath,logLine) {
    const logDate=new Date();
    let time=logDate.toLocaleDateString()+" "+logDate.toLocaleTimeString();
    let fullLogLine=time+" "+logLine;

    console.log(fullLogLine);

    const logFileRecord = fs.openSync(logFilePath, 'a+');
    fs.writeSync(logFileRecord, fullLogLine + os.EOL);
    fs.closeSync(logFileRecord);
}


webserver.post('/postman', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint called');


    res.status(200);
});


webserver.listen(port,()=>{
    logLineSync(logFilePath,"web server3095 running on port "+port);
});