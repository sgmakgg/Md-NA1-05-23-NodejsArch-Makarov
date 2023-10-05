const fs = require('fs');
const fsp = fs.promises;
const os = require('os');
const path = require('path');
const Jimp = require("jimp");

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

function escapeHTML(text) {
    if ( !text )
        return text;
    text=text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

async function compressImage(sourcePFN, resultPFN, newWidth) {

    let result = await Jimp.read(sourcePFN);
    const {width, height} = result.bitmap; // это размеры большой картинки

    let newHeight = height/width*newWidth; // ширину маленькой картинки знаем, вычисляем высоту маленькой

    // при любом способе записи файла он некоторое время виден в файловой системе с длиной 0
    // а у нас в get-запросе определяется, нет ли уже сохранённого файла с нужным именем, и пустой будет обнаружен и возвращён клиенту
    // поэтому, ВСЕГДА сначала (медленно) пишем в файл со ВРЕМЕННЫМ именем, а потом переименовываем файл в нужное имя (это моментально)

    // но временное имя файла надо сделать с таким же расширением, с каким будет постоянное
    // т.к. jimp определяет ФОРМАТ записи (jpeg/png) по РАСШИРЕНИЮ файла (глупо, конечно)
    let resultTempPFN=getTempFileName(resultPFN);

    result.resize(newWidth, newHeight);
    result.quality(100);
    await result.writeAsync(resultTempPFN); // медленно пишем в файл со временным именем

    await fsp.rename(resultTempPFN,resultPFN); // быстро переименовываем в нужное имя
}

function getTempFileName(targetPFN,postfix="_tmp") {
    const targetPathParts=path.parse(targetPFN);
    return targetPathParts.dir+path.sep+targetPathParts.name+postfix+targetPathParts.ext;
}

module.exports={
    logLineAsync,
    escapeHTML,
    compressImage
}