const readline = require('readline');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

const {do_gzip} = require("./utils");


const ARCDIR = 'archive';
let arcDirPath ='';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter full path > "
});

rl.prompt();

rl.on('line', async (fullPath) => {

    if ( !fullPath )
        rl.close();
    else {
        arcDirPath = path.join(fullPath, ARCDIR);
        await compressFiles(fullPath, arcDirPath);
        }
        rl.prompt();
});

rl.on('close', () => {
    console.log('Good bye!');
    process.exit(0);
});

async function compressFiles(source, destination) {
    let filesPath = source;
    let arcPath = destination;

    try{
        await fsp.access(arcPath);
        console.log(`${'Archive path ' +arcPath+ ' exists'}`)
    }
    catch{
        console.log(`${'Archive path ' +arcPath+ ' does not exists'}`);
        await fsp.mkdir(arcPath);
        console.log("Archive path created");
    }

    let files = await fsp.readdir(filesPath, {withFileTypes: true});

    for (let file of files) {
        if (file.isFile()) {
            try {
                await fsp.access(path.join(arcPath, `${file.name + '.gz'}`));
                console.log(`${'Archive file ' + `${file.name + '.gz'}` + ' exists'}`);
                let mainFile = await fsp.stat(path.join(filesPath, `${file.name}`));
                let arcFile = await fsp.stat(path.join(arcPath, `${file.name + '.gz'}`));

                if (arcFile.mtime < mainFile.mtime) {
                    console.log(`${'Archive file ' + `${file.name + '.gz'}` + ' older than ' + `${file.name}`}`);
                    console.log('Recompression started: ' + file.name);

                    try{
                        await do_gzip(path.join(filesPath, file.name), path.join(arcPath, `${file.name + '.gz'}`));
                        console.log('File compression finished: ' + file.name)
                    }
                    catch(err){
                        console.error('An error occurred:', err);
                        process.exitCode = 1;
                    }
                }
            }
            catch {
                console.log(`${'Archive file ' + `${file.name + '.gz'}` + ' does not exist'}`);
                console.log(`${'Source path ' + filesPath}`);
                console.log(`${'Destination path ' + arcPath}`);
                console.log('File compression started: ' + file.name);

                try{
                    await do_gzip(path.join(filesPath, file.name), path.join(arcPath, `${file.name + '.gz'}`));
                    console.log('File compression finished: ' + file.name);
                }
                catch(err){
                    console.error('An error occurred:', err);
                    process.exitCode = 1;
                }
            }
        }
        else if (file.isDirectory()) {
            if (file.name !== ARCDIR) {
                await compressFiles(path.join(filesPath, file.name), path.join(arcPath, file.name));
            }
        }
    }
}