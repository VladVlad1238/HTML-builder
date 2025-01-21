const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');

function writeFile() {
  if (!fs.existsSync('./text.txt')) {
    fs.writeFile(filePath, '', (err) => {
      if (err) throw err;
      console.log('File created');
    });
  }

  stdout.write('What is your name?\n');

  stdin.on('data', (data) => {
    const inputData = data.toString().trim();

    if (inputData === 'exit') {
      stdout.write('Goodbye!\n');
      process.exit();
    }

    fs.appendFile(filePath, `${inputData}\n`, (err) => {
      if (err) throw err;
      console.log('Data saved');
    });
  });

  process.on('SIGINT', () => {
    stdout.write('\nGoodbye!\n');
    process.exit();
  });
}
writeFile();
