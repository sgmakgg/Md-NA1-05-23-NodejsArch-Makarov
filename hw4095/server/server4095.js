import express from 'express';

import cors from 'cors';

const webserver = express();

import path from 'path';
import { fileURLToPath } from 'url';


import {bodyValidation} from "./utils/validation.js";
import logLineAsync from "./utils/logger.js";
import RequestToAPI from "./utils/apireq.js";

const port = 4095;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, '_server.log');

webserver.use(cors());
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

webserver.use(function (req, res, next) {
    logLineAsync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    express.static(path.resolve(__dirname,"../client/build"))
);

webserver.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", 'index.html'));
});

webserver.post('/postman', (req, res) => {
    logLineAsync(logFilePath,`[${port}] `+'"/postman" endpoint called\xa0' + `get req.body:  ${JSON.stringify(req.body)}`);

        if(req.accepts('application/json')){
            const validationResult = bodyValidation(req.body);

            if(validationResult.length === 0){
                if(req.body.method === 'GET'){
                    logLineAsync(logFilePath,`[${port}] `+'"/postman" endpoint called' + `received GET request `);
                    let urlParamPart =  null;

                    if(req.body.parameters.length !== 0){
                        urlParamPart =  new URLSearchParams();
                        req.body.parameters.forEach(item => (urlParamPart.append(item.key, item.value)));
                        logLineAsync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `created urlParamPart:  ${urlParamPart}`);
                    }

                    let fetchConfig={
                        URL: (urlParamPart ===  null) ? req.body.url : (req.body.url + '?' + urlParamPart),
                        method: req.body.method
                    };

                    fetchConfig.headers = ParseHeaders(req.body.contentTypes);
                    logLineAsync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `created fetchConfig:  ${JSON.stringify(fetchConfig)}`);

                    RequestToAPI(fetchConfig, res, logFilePath, port);
                }

                if(req.body.method === 'POST'){
                    logLineAsync(logFilePath,`[${port}] `+'"/postman" endpoint called' + `received POST request `);
                    let fetchConfig={
                        URL: req.body.url,
                        method: req.body.method
                    };
                    fetchConfig.headers = ParseHeaders(req.body.contentTypes);
                    fetchConfig.body = req.body.body;
                    logLineAsync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `created fetchConfig:  ${JSON.stringify(fetchConfig)}`);
                    RequestToAPI(fetchConfig, res, logFilePath, port);
                }
            }
            else res.status(405).send(validationResult);
        }
        else res.status(400).end();
});

webserver.listen(port,()=>{
    logLineAsync(logFilePath,"web server3095 running on port "+port);
});

function ParseHeaders(reqConTypesObj){
    let tempObj = {};
    reqConTypesObj.forEach(item=> tempObj[item.key] = item.value);
    return tempObj;
}



