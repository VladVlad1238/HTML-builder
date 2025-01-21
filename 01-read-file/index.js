const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

function readFile() {
  const pathToFile = path.join(__dirname, 'text.txt');
  const rs = fs.createReadStream(pathToFile, { emitClose: 'utf-8' });
  rs.pipe(stdout);

  rs.on('error', (err) => {
    console.error(err.message);
  });
}
readFile();
