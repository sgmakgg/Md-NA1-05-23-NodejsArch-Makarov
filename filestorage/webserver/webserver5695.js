const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

const port = 5695;
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

webserver.listen(port,()=>{
    logLineAsync(logFilePath,"web server running on port "+port);
});