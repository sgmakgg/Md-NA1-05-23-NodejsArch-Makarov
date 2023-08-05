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
    logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint called ' + `get req.body:  ${JSON.stringify(req.body)}`);

        if(req.body.method === 'GET' && req.body.parameters.length === 0){
            let fetchConfig={
                URL: req.body.url,
                method: req.body.method
            };

            fetchConfig.headers = ClientHeadersToReqHeaderParser(req.body.contentTypes);
            logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `created fetchConfig:  ${JSON.stringify(fetchConfig)}`);

            SendResponseToClient(fetchConfig, res);
        }
});


webserver.listen(port,()=>{
    logLineSync(logFilePath,"web server3095 running on port "+port);
});

async function SendResponseToClient  (fetchConfig, res){
    let clientResponseObj = {};
    try {
        let response=await fetch(fetchConfig.URL, fetchConfig);

        if (!response.ok) {
            throw new Error("fetch error " + response.status);
        }

        clientResponseObj.status = response.status;
        clientResponseObj.contentType = response.headers.get('Content-Type');
        clientResponseObj.headers = {};
        for (let [key, value] of response.headers) {
            clientResponseObj.headers[key] = value;
        }

        let data=await response.json();
        clientResponseObj.body =  JSON.stringify(data);

        res.send(JSON.stringify(clientResponseObj)).status(200);
    }
    catch ( error )  {
        console.log(error.message);
    }
}

function ClientHeadersToReqHeaderParser(reqConTypesObj){
    let tempObj = {};
    reqConTypesObj.forEach(item=> tempObj[item.key] = item.value);
    return tempObj;
}