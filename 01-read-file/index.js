const fs = require('fs');
const path = require('path');

function readFile() {
  const pathToFile = path.join(__dirname, 'text.txt');
  const stream = fs.createReadStream(pathToFile, 'utf-8');
  stream.on('data', (data) => {
    console.log(data);
  });
  stream.on('error', (err) => {
    console.error(err.message);
  });
}
readFile();
