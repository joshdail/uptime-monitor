const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');

const logs = {};

logs.basedir = path.join(__dirname, '/../.data/');

logs.append = async function(file, str) {
  try {
    let fileDescriptor = await fs.open(logs.basedir + file + '.log', 'a');
    await fs.appendFile(fileDescriptor, str + '\n');
    await fileDescriptor.close();
  } catch (e) {
    console.log(`Error writing to log\n${e}`);
  }
};

logs.compress = async function(file) {
  try {
    let sourceFile = file + '.log';
    let destFile = file + '.gz.b64';
    let data = await fs.readFile(lib.basedir + sourceFile, 'utf8');
    zlib.gzip(data, async function(err, buffer) {
      if (!err && buffer) {
        let fileDescriptor = await fs.open(lib.basedir + destFile, 'wx');
        await fs.writeFile(fileDescriptor, buffer.toString('base64'));
        await fileDescriptor.close();
      } else {
        throw err;
      }
    });
  } catch (e) {
    console.log(`Error compressing log\n${e}`);
  }
};

logs.decompress = async function(file) {
  try {
    let fileName = file + '.gz.b64';
    let data = await fs.readFile(fileName);
    let inputBuffer = Buffer.from(data, 'base64');
    zlib.unzip(inputBuffer, function(err, outputBuffer) {
      if (!err && outputBuffer) {
        let str = outputBuffer.toString();
        return str;
      } else {
        throw err;
      }
    });
  } catch (e) {
    console.log(`Error decompressing log\n${e}`);
  }
};

// Lists log file names without extension
logs.list = async function() {
  try {
    let data = await fs.readdir(logs.basedir);
    if (data) {
      let fileNames = [];
      data.forEach(function(fileName) {
        fileNames.push(fileName);
      });
      return fileNames;
    }
  } catch (e) {
    console.log(`Error listing logs\n${e}`);
  }
};

logs.open = async function(file) {
  try {
    let data = await fs.readFile(logs.basedir + file, {
      encoding: 'utf-8'
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};

module.exports = logs;