import logLineAsync from "./logger.js";

export default async function RequestToAPI  (fetchConfig, res, logFilePath, port){
    let clientResponseObj = {};
    try {
        let response=await fetch(fetchConfig.URL, fetchConfig);

        clientResponseObj.status = response.status;
        clientResponseObj.headers = [];
        for (let [key, value] of response.headers) {
            clientResponseObj.headers.push({key: key, value: value});
        }

        clientResponseObj.body =  await response.json();

        logLineAsync(logFilePath,`[${port}] `+'"/postman" endpoint ' + `response sent to client:  ${JSON.stringify(clientResponseObj)}`);
        res.setHeader('Content-Type', 'application/json')
        res.send(clientResponseObj).status(200);
    }
    catch ( error )  {
        console.log(error.message);
    }
}