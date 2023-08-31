const express = require('express');
const path = require('path');

const fs = require('fs');
const fsp = fs.promises;
const {logLineAsync, escapeHTML} = require("./utils");

const webserver = express();
webserver.use(express.urlencoded({extended:true}));

const port = 6195;
const logFilePath = path.join(__dirname, '_server.log');

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