const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

const port = 3097;
const logFilePath = path.join(__dirname, '_server.log');

function logLineSync(logFilePath,logLine) {
    const logDate=new Date();
    let time=logDate.toLocaleDateString()+" "+logDate.toLocaleTimeString();
    let fullLogLine=time+" "+logLine;

    console.log(fullLogLine);

    const logFileRecord = fs.openSync(logFilePath, 'a+');
    fs.writeSync(logFileRecord, fullLogLine + os.EOL);
    fs.closeSync(logFileRecord);
}

webserver.get('/login', (req, res) => {
    logLineSync(logFilePath,`[${port}] `+'login endpoint called');
    console.log(req.query);

    if (typeof req.query.login === 'undefined' || typeof req.query.password === 'undefined'){
        res.status(200).sendFile( path.resolve(__dirname,"loginForm.html"));
    }
    else{
        if(req.query.login === '' || req.query.password === ''){
            res.status(401).send(`<div class="Login">
                            <form method=GET target='_self'>
                                Your login: <input type=text name=login value=${req.query.login}><br/>
                                Your password: <input type=number name=password value=${req.query.password}><br/>
                                <input type=submit value="Login">
                            </form>
                        </div>` + '<div>form fields cannot be empty</div>');
        }
        else{
            res.status(200).send('logged in successfully');
        }
    }
});

webserver.listen(port,()=>{
    logLineSync(logFilePath,"hw3097 web server running on port "+port);
});
