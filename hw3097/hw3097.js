const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

const port = 3097;
const logFilePath = path.join(__dirname, '_server.log');

function logLineAsync(logFilePath,logLine) {

    return new Promise( (resolve,reject) => {

        const logDT=new Date();
        let time=logDT.toLocaleDateString()+" "+logDT.toLocaleTimeString();
        let fullLogLine=time+" "+logLine;

        console.log(fullLogLine); // выводим сообщение в консоль

        fs.open(logFilePath, 'a+', (err,logFd) => {
            if ( err )
                reject(err);
            else
                fs.write(logFd, fullLogLine + os.EOL, (err) => {
                    if ( err )
                        reject(err);
                    else
                        fs.close(logFd, (err) =>{
                            if ( err )
                                reject(err);
                            else
                                resolve();
                        });
                });

        });

    } );
}

webserver.use(function (req, res, next) {
    logLineAsync(logFilePath,`[${port}] `+"static server called, originalUrl="+req.originalUrl);
    next();
});

webserver.use(
    "/mysite",
    express.static(path.resolve(__dirname,"static"))
);

webserver.post('/login', (req, res) => {
    logLineAsync(logFilePath,`[${port}] `+'login endpoint called');
    console.log(req.query);

    if (typeof req.body.login === 'undefined' || typeof req.body.password === 'undefined'){
        res.status(200).sendFile( path.resolve(__dirname,"static/loginForm.html"));
    }
    else{
        if(req.body.login === '' || req.body.password === ''){
            res.status(401).send(`<div class="Login">
                            <form method=POST target='_self' action="/login">
                                Your login: <input type=text name=login value=${req.body.login}><br/>
                                Your password: <input type=number name=password value=${req.body.password}><br/>
                                <input type=submit value="Login">
                            </form>
                        </div>` + '<div>form fields cannot be empty</div>');
        }
        else{
            res.redirect(301,'/mysite/success.html')
        }
    }
});

webserver.listen(port,()=>{
    logLineAsync(logFilePath,"hw3097 web server running on port "+port);
});
