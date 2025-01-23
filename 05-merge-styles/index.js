const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'styles');
const destinationFolder = path.join(__dirname, 'project-dist');
const bundlerFile = path.join(destinationFolder, 'bundle.css');
console.log(sourceFolder);
console.log(bundlerFile);

function mergeStyles() {
  // check if folder dest folder exist
  fs.mkdir(destinationFolder, { recursive: true }, (err) => {
    if (err) throw err;
  });

  // read files from source folder with file types
  fs.readdir(sourceFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    // filter files by ext name
    const filteredFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );
    console.log(filteredFiles);

    // create stream to create bundle.css
    const ws = fs.createWriteStream(bundlerFile);

    //  create strem to read data from source folder and push them to bundle.css
    filteredFiles.forEach((file, index) => {
      const filePath = path.join(sourceFolder, file.name);

      const rs = fs.createReadStream(filePath, 'utf-8');
      // end: false because we want manual control under stream
      rs.pipe(ws, { end: false });
      // finish strem if its already last file in arr
      rs.on('end', () => {
        if (index === filteredFiles.length - 1) {
          ws.end();
        }
      });
      // check for errors
      rs.on('error', (err) => console.error(err.message));
    });
    console.log('Bundle.css was created');
  });
}

mergeStyles();
