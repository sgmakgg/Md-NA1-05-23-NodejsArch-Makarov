const { createGzip } = require('zlib');
const { pipeline } = require('node:stream');
const {
    createReadStream,
    createWriteStream,
} = require('fs');

const { promisify } = require('util');
const pipe = promisify(pipeline);

async function do_gzip(input, output) {
    const gzip = createGzip();
    const source = createReadStream(input);
    const destination = createWriteStream(output);
    await pipe(source, gzip, destination);
}

module.exports={
    do_gzip
}
