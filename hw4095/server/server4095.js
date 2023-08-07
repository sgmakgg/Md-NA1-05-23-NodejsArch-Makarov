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

webserver.use(function (req, res, next) {
    logLineSync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    express.static(path.resolve(__dirname,"../client/build"))
);

webserver.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", 'index.html'));
});

webserver.post('/postman', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint called\xa0' + `get req.body:  ${JSON.stringify(req.body)}`);

        if(req.body.method === 'GET'){
            logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint called' + `received GET request `);
            let urlParamPart =  null;

            if(req.body.parameters.length !== 0){
                urlParamPart =  new URLSearchParams();
                req.body.parameters.forEach(item => (urlParamPart.append(item.key, item.value)));
                logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `created urlParamPart:  ${urlParamPart}`);
            }

            let fetchConfig={
                URL: (urlParamPart ===  null) ? req.body.url : (req.body.url + '?' + urlParamPart),
                method: req.body.method
            };

            fetchConfig.headers = HeadersOrParametersParser(req.body.contentTypes);
            logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `created fetchConfig:  ${JSON.stringify(fetchConfig)}`);

            SendRequestToClient(fetchConfig, res);
        }

        if(req.body.method === 'POST'){
            logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint called' + `received POST request `);
            let fetchConfig={
                URL: req.body.url,
                method: req.body.method
            };
            fetchConfig.headers = HeadersOrParametersParser(req.body.contentTypes);
            fetchConfig.body = req.body.body;
            logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `created fetchConfig:  ${JSON.stringify(fetchConfig)}`);
            SendRequestToClient(fetchConfig, res);
        }
});


webserver.listen(port,()=>{
    logLineSync(logFilePath,"web server3095 running on port "+port);
});

async function SendRequestToClient  (fetchConfig, res){
    let clientResponseObj = {};
    try {
        let response=await fetch(fetchConfig.URL, fetchConfig);

        clientResponseObj.status = response.status;
        clientResponseObj.headers = [];
        for (let [key, value] of response.headers) {
            clientResponseObj.headers.push({key: key, value: value});
        }

        clientResponseObj.body =  await response.json();

        logLineSync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `response sent to client:  ${JSON.stringify(clientResponseObj)}`);
        res.setHeader('Content-Type', 'application/json')
        res.send(clientResponseObj).status(200);
    }
    catch ( error )  {
        console.log(error.message);
    }
}

function HeadersOrParametersParser(reqConTypesObj){
    let tempObj = {};
    reqConTypesObj.forEach(item=> tempObj[item.key] = item.value);
    return tempObj;
}